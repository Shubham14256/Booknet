import { NavBar } from "@/components/nav-bar";
import { AuthForm } from "@/components/auth-form";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <NavBar />
      <main className="mx-auto flex max-w-7xl flex-col items-center px-6 py-14">
        <div className="mb-8 max-w-xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight">Secure Access</h1>
          <p className="mt-3 text-zinc-400">
            Login or create your DevReads account to continue to checkout.
          </p>
        </div>
        <AuthForm />
      </main>
    </div>
  );
}
