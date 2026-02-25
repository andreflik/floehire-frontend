import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function RecruiterLogin() {
    const navigate = useNavigate();
    const { loginRecruiter } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await loginRecruiter({ email, password });
            navigate("/recruiter/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erro inesperado");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm relative">

                    <button
                        onClick={() => navigate("/")}
                        className="
              absolute top-4 left-4
              w-9 h-9
              flex items-center justify-center
              rounded-full
              bg-[#FFD700] text-black
              shadow-sm
              hover:opacity-90
              transition
            "
                        title="Voltar"
                    >
                        ←
                    </button>

                    <div className="text-center mb-6 mt-4">
                        <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-yellow-100 mb-3">
                            <span className="text-xl">🏢</span>
                        </div>
                        <h1 className="text-2xl font-bold text-black">Entrar como Empresa</h1>
                        <p className="text-gray-600 text-sm">Acesse sua conta FloeHire</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                E-mail
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="empresa@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Senha
                            </label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="Digite sua senha"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FFD700] text-black font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-60"
                        >
                            {loading ? "Entrando..." : "Acessar painel"}
                        </button>
                    </form>

                    <div className="text-center text-sm text-gray-600 mt-6">
                        Ainda não tem conta?{" "}
                        <span
                            onClick={() => navigate("/register/recruiter")}
                            className="text-yellow-500 font-medium cursor-pointer hover:underline"
                        >
                            Cadastrar empresa
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}