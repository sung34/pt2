import { ModeToggle } from "../components/mode-toggle";


export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8">
      <div className="w-full flex justify-end">
        <ModeToggle />
      </div>
    </main>
  );
}
