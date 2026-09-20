import { Link, useNavigate } from "@/utils/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthLayout } from "@/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, PasswordInput } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { GoogleButton } from "@/components/auth/google-button";
import { useAuthFlow, clearAssessmentDraft } from "@/hooks/use-auth-flow";

const schema = z
  .object({
    name: z.string().min(2, "Tell us your name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export function SignupPage() {
  const navigate = useNavigate();
  const { signUp, pending } = useAuthFlow();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await signUp({ name: values.name, email: values.email });
      clearAssessmentDraft();
      toast.success("Account created", { description: "Let's understand your financial knowledge." });
      navigate("/assessment");
    } catch {
      toast.error("Couldn't create your account", { description: "Please try again." });
    }
  });

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Two minutes to set up. Your first decision is five.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" autoComplete="name" placeholder="Aarav Sharma" {...form.register("name")} />
          <FieldError>{form.formState.errors.name?.message}</FieldError>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...form.register("email")}
          />
          <FieldError>{form.formState.errors.email?.message}</FieldError>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            {...form.register("password")}
          />
          <FieldError>{form.formState.errors.password?.message}</FieldError>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <PasswordInput
            id="confirm"
            autoComplete="new-password"
            placeholder="Repeat your password"
            {...form.register("confirm")}
          />
          <FieldError>{form.formState.errors.confirm?.message}</FieldError>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting || pending}>
          {(form.formState.isSubmitting || pending) && <Loader2 className="animate-spin" />}
          Create account
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/40">or</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <GoogleButton label="Sign up with Google" />

      <p className="mt-8 text-center text-sm text-white/55">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-white hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
