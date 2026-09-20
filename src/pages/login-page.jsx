import { Link, useNavigate } from "@/utils/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, PasswordInput } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { AuthLayout } from "@/layouts/auth-layout";
import { useAuthFlow } from "@/hooks/use-auth-flow";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
  remember: z.boolean().optional(),
});

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signInAsGuest, pending } = useAuthFlow();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await signIn({ email: values.email });
      toast.success("Welcome back.");
      navigate("/assessment");
    } catch {
      toast.error("Sign in failed", { description: "Please try again." });
    }
  });

  const onGuestLogin = () => {
    signInAsGuest();
    toast("Signed in as guest", { description: "Your progress is saved on this device." });
    navigate("/assessment");
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue your learning journey."
      footer={
        <p>
          New to FinQuest?{" "}
          <Link to="/signup" className="font-medium text-blue-400 transition hover:text-blue-300">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...form.register("email")} />
          <FieldError>{form.formState.errors.email?.message}</FieldError>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              className="text-xs text-white/45 transition-colors hover:text-white"
              onClick={() =>
                toast("Password reset is coming soon", {
                  description: "Meanwhile, guest login gets you in instantly.",
                })
              }
            >
              Forgot password?
            </button>
          </div>
          <PasswordInput id="password" autoComplete="current-password" placeholder="••••••••" {...form.register("password")} />
          <FieldError>{form.formState.errors.password?.message}</FieldError>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-white/55">
          <input type="checkbox" className="size-4 accent-[var(--primary)]" {...form.register("remember")} />
          Remember me
        </label>

        <Button type="submit" size="lg" className="w-full bg-brand-duo font-medium hover:opacity-90" disabled={form.formState.isSubmitting || pending}>
          {(form.formState.isSubmitting || pending) && <Loader2 className="animate-spin" />}
          Login
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/35">or</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <div className="space-y-2.5">
        <GoogleButton label="Continue with Google" />
        <Button type="button" variant="outline" size="lg" className="w-full border-white/15 bg-white/[0.03] font-medium text-white/85 hover:bg-white/[0.07] hover:text-white" onClick={onGuestLogin}>
          Guest Login
        </Button>
        <p className="text-center text-xs text-white/35">Guest login skips the forms — straight to the assessment.</p>
      </div>
    </AuthLayout>
  );
}
