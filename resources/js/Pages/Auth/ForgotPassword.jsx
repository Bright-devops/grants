import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Mail, SendHorizontal, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div>

                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                    Account Recovery
                </span>

                <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
                    Forgot Password?
                </h1>

                <p className="mt-4 text-lg leading-8 text-slate-600">
                    No problem. Just let us know your email address and we
                    will send you a password reset link.
                </p>

            </div>

            {status && (

                <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    {status}
                </div>

            )}

            <form
                onSubmit={submit}
                className="mt-10 space-y-7"
            >

                {/* EMAIL */}

                <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Email Address
                    </label>

                    <div className="relative">

                        <Mail
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="email"
                            value={data.email}
                            autoComplete="username"
                            autoFocus
                            onChange={(e) =>
                                setData("email", e.target.value)
                            }
                            placeholder="Enter your email address"
                            className={`h-14 w-full rounded-2xl border pl-12 pr-4 transition outline-none focus:ring-4 focus:ring-blue-100 ${
                                errors.email
                                    ? "border-red-400"
                                    : "border-slate-300 focus:border-blue-600"
                            }`}
                        />

                    </div>

                    {errors.email && (

                        <p className="mt-2 text-sm text-red-600">
                            {errors.email}
                        </p>

                    )}

                </div>

                {/* SUBMIT */}

                <button
                    type="submit"
                    disabled={processing}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >

                    {processing ? (

                        <>
                            <Loader2
                                size={20}
                                className="animate-spin"
                            />
                            Sending Link...
                        </>

                    ) : (

                        <>
                            <SendHorizontal size={20} />
                            Email Password Reset Link
                        </>

                    )}

                </button>

                {/* BACK TO LOGIN */}

                <p className="flex items-center justify-center gap-2 text-center text-sm font-semibold text-blue-600">

                    <Link
                        href={route("login")}
                        className="flex items-center gap-2 transition hover:text-blue-700"
                    >
                        <ArrowLeft size={16} />
                        Back to Sign In
                    </Link>

                </p>

            </form>

        </GuestLayout>
    );
}