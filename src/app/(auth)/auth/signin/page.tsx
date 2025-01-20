import { SignInForm } from '@/components/SignInForm';
export default function SignIn() {
  return (
    <div className="min-h-screen relative bg-black">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-blue-600/30 to-transparent animate-gradient" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <SignInForm />
      </div>
    </div>
  );
}