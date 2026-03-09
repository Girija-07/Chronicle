import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Chronicle
          </h1>
          <Link
            href="/login"
            className="flex h-12 items-center justify-center rounded-full bg-zinc-900 dark:bg-white px-8 text-white dark:text-zinc-900 font-medium transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-100"
          >
            Login
          </Link>
        </div>
      </main>
    </div>
  );
}
