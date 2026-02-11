export default function CandidateLogin() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-full max-w-md px-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-yellow-100 mb-3">
                            <span className="text-xl">👤</span>
                        </div>
                        <h1 className="text-2xl font-bold text-black">
                            Entrar com sua conta
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Candidato - Acesse sua conta FloeHire
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                E-mail ou CPF
                            </label>
                            <input
                                type="text"
                                placeholder="seu@email.com ou 123.456.789-00"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Senha
                                </label>
                                <a
                                    href="#"
                                    className="text-sm text-yellow-500 hover:underline"
                                >
                                    Esqueceu a senha?
                                </a>
                            </div>
                            <input
                                type="password"
                                placeholder="Digite sua senha"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#FFD700] text-black font-semibold py-2.5 rounded-lg hover:opacity-90 transition"
                        >
                            Acessar conta
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="px-3 text-xs text-gray-400">OU ENTRAR COM</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Social buttons */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            disabled
                            className="w-full border border-gray-300 text-gray-400 py-2.5 rounded-lg cursor-not-allowed"
                        >
                            Google (em breve)
                        </button>

                        <button
                            type="button"
                            disabled
                            className="w-full border border-gray-300 text-gray-400 py-2.5 rounded-lg cursor-not-allowed"
                        >
                            LinkedIn (em breve)
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-600 mt-6">
                        Não tem uma conta?{" "}
                        <span className="text-yellow-500 font-medium cursor-pointer hover:underline">
                            Criar conta
                        </span>
                    </div>
                </div>

                {/* Legal */}
                <p className="text-center text-xs text-gray-400 mt-4">
                    Ao fazer login, você concorda com nossos{" "}
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
