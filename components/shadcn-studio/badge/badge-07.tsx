import { Badge } from '@/components/ui/badge'

const NotificationBadge = ({value}: {value: number}) => {
  return <Badge className='h-5 min-w-5 rounded-full font-bold text-[14px] px-1 tabular-nums bg-red-500 text-white'>{value}</Badge>
}

export default NotificationBadge
