const { parse } = require('csv-parse/sync');
const fs = require('fs');
require('dotenv/config');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// CSV 파일 읽기
const csv = fs.readFileSync('PT영어 - 원생부.csv', 'utf-8');
const records = parse(csv, { columns: true, skip_empty_lines: true });

// FK 매핑용: 학교명, 단어장명 → id 조회
async function getSchoolId(name: string | undefined) {
  if (!name) return null;
  const { data } = await supabase.from('school').select('school_id').ilike('name', `%${name}%`).single();
  return data?.school_id || null;
}
async function getVocabBookId(name: string | undefined) {
  if (!name) return null;
  const { data } = await supabase.from('vocabulary_book').select('book_id').eq('name', name).single();
  return data?.book_id || null;
}

function parseBoolean(val: string | undefined) {
  if (!val) return false;
  return val.trim().toLowerCase() === 'true';
}

function parseNumber(val: string | undefined) {
  if (!val) return null;
  const n = parseInt(val, 10);
  return isNaN(n) ? null : n;
}

function parseAttendance(row: any) {
  const days = ['월', '화', '수', '목', '금'];
  const dayEnums = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  const result = [];
  for (let i = 0; i < days.length; i++) {
    const time = row[days[i]]?.replace('오후', '').replace('오전', '').trim();
    if (time) {
      // HH:MM:SS → HH:MM
      const [h, m] = time.split(':');
      result.push({ day_of_week: dayEnums[i], start_time: `${h.padStart(2, '0')}:${m}` });
    }
  }
  return result.length > 0 ? result : null;
}

async function main() {
  for (const row of records) {
    if (!row['원생 이름']) continue;
    const schoolId = await getSchoolId(row['학교명']);
    const vocabBookId = await getVocabBookId(row['단어장']);
    const attendance = parseAttendance(row);
    const insertObj: any = {
      name: row['원생 이름'],
      grade_level_display: row['학년'],
      school_id: schoolId,
      status: 'active',
      memo: row['메모'] || null,
      is_exam_period: false,
      is_writing_english: parseBoolean(row['영어쓰기']),
      current_vocab_book_id: vocabBookId,
      vocab_current_target_day: parseNumber(row['단어날짜']) || 0,
      vocab_is_descending: parseBoolean(row['내림']),
      vocab_days_per_session: 1,
      attendance_schedule: attendance,
    };
    const { error } = await supabase.from('student').insert([insertObj]);
    if (error) {
      console.error('Insert error:', error, row['원생 이름']);
    } else {
      console.log('Inserted:', row['원생 이름']);
    }
  }
}

main(); 