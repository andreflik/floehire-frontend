import { useNavigate } from "react-router-dom";

export default function CandidateRegister() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-full max-w-md px-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-yellow-100 mb-3">
                            <span className="text-xl">📝</span>
                        </div>
                        <h1 className="text-2xl font-bold text-black">
                            Criar conta de Candidato
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Cadastre-se para encontrar vagas e se candidatar
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-4">
                        {/* Nome */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome completo
                            </label>
                            <input
                                type="text"
                                placeholder="Seu nome completo"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                E-mail
                            </label>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>

                        {/* CPF */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                CPF
                            </label>
                            <input
                                type="text"
                                placeholder="000.000.000-00"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>

                        {/* Senha */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Senha
                            </label>
                            <input
                                type="password"
                                placeholder="Crie uma senha"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>

                        {/* Confirmar senha */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirmar senha
                            </label>
                            <input
                                type="password"
                                placeholder="Repita sua senha"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>

                        {/* Botão */}
                        <button
                            type="submit"
                            className="w-full bg-[#FFD700] text-black font-semibold py-2.5 rounded-lg hover:opacity-90 transition"
                        >
                            Criar conta
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-600 mt-6">
                        Já tem uma conta?{" "}
                        <span
                            onClick={() => navigate("/login/candidate")}
                            className="text-yellow-500 font-medium cursor-pointer hover:underline"
                        >
                            Entrar
                        </span>
                    </div>
                </div>

                {/* Legal */}
                <p className="text-center text-xs text-gray-400 mt-4">
                    Ao criar uma conta, você concorda com nossos{" "}
                    <span className="text-yellow-500 cursor-pointer">Termos de Uso</span> e{" "}
                    <span className="text-yellow-500 cursor-pointer">
                        Política de Privacidade
                    </span>
                    .
                </p>
            </div>
        </div>
    );
}
