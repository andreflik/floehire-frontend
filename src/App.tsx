export default function App() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-5xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-2">
            Bem-vindo ao FloeHire
          </h1>
          <p className="text-gray-600">
            Escolha como você deseja acessar a plataforma
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
          {/* Card Candidato */}
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-100 mb-4">
                <span className="text-2xl">👤</span>
              </div>

              <h2 className="text-xl font-semibold text-black mb-2">
                Sou Candidato
              </h2>

              <p className="text-gray-600 mb-6">
                Encontre vagas, candidate-se e acompanhe seu processo seletivo
              </p>

              <button className="w-full bg-[#FFD700] text-black font-semibold py-2.5 rounded-lg hover:opacity-90 transition">
                Entrar como Candidato
              </button>

              <p className="text-xs text-gray-400 mt-4">
                Ao fazer login, você concorda com nossos Termos de Uso e Política
                de Privacidade (LGPD)
              </p>
            </div>
          </div>

          {/* Card Empresa */}
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-100 mb-4">
                <span className="text-2xl">🏢</span>
              </div>

              <h2 className="text-xl font-semibold text-black mb-2">
                Sou Empresa
              </h2>

              <p className="text-gray-600 mb-6">
                Publique vagas, gerencie candidatos e organize seu recrutamento
              </p>

              <button className="w-full bg-[#FFD700] text-black font-semibold py-2.5 rounded-lg hover:opacity-90 transition">
                Entrar como Empresa
              </button>

              <p className="text-xs text-gray-400 mt-4">
                Ao fazer login, você concorda com nossos Termos de Uso e Política
                de Privacidade (LGPD)
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-10 max-w-xl mx-auto">
          Ainda não tem conta? Ao clicar em "Entrar", você poderá criar uma nova
          conta. A recuperação de senha está disponível na tela de login.
        </div>
      </div>
    </div>
  );
}
