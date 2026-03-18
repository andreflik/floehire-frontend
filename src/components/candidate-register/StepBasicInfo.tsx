import type { CandidateFormData } from "../../pages/CandidateRegisterWizard";

type Props = {
    data: CandidateFormData;
    onChange: (data: CandidateFormData) => void;
    onNext: () => void;
};

export default function StepBasicInfo({ data, onChange, onNext }: Props) {
    function handleChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const { name, value, type, checked } = e.target;

        onChange({
            ...data,
            [name]: type === "checkbox" ? checked : value,
        });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!data.full_name || !data.email || !data.password) {
            alert("Preencha nome, email e senha");
            return;
        }

        if (data.password.length < 6) {
            alert("A senha deve ter no mínimo 6 caracteres");
            return;
        }

        if (data.password !== data.confirm_password) {
            alert("As senhas não coincidem");
            return;
        }

        if (!data.lgpd_consent) {
            alert("Você precisa aceitar os termos (LGPD)");
            return;
        }

        onNext();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-4"
        >
            <h2 className="text-xl font-semibold text-black mb-2">
                Dados básicos
            </h2>

            <div>
                <label className="block text-sm text-gray-700 mb-1">
                    Nome completo *
                </label>
                <input
                    name="full_name"
                    value={data.full_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    placeholder="Seu nome completo"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-700 mb-1">
                    E-mail *
                </label>
                <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    placeholder="seu@email.com"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-700 mb-1">
                    Senha *
                </label>
                <input
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    placeholder="Crie uma senha"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-700 mb-1">
                    Confirmar senha *
                </label>
                <input
                    type="password"
                    name="confirm_password"
                    value={data.confirm_password || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    placeholder="Confirme sua senha"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-700 mb-1">
                    Telefone
                </label>
                <input
                    name="phone"
                    value={data.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    placeholder="(99) 99999-9999"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-700 mb-1">
                        Cidade
                    </label>
                    <input
                        name="city"
                        value={data.city}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                        placeholder="Cidade"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-1">
                        Estado
                    </label>
                    <input
                        name="state"
                        value={data.state}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                        placeholder="UF"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm text-gray-700 mb-1">
                    LinkedIn
                </label>
                <input
                    name="linkedin_url"
                    value={data.linkedin_url}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    placeholder="https://linkedin.com/in/..."
                />
            </div>

            <div>
                <label className="block text-sm text-gray-700 mb-1">
                    GitHub
                </label>
                <input
                    name="github_url"
                    value={data.github_url}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    placeholder="https://github.com/..."
                />
            </div>

            <div>
                <label className="block text-sm text-gray-700 mb-1">
                    Portfólio
                </label>
                <input
                    name="portfolio_url"
                    value={data.portfolio_url}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    placeholder="https://meuportfolio.com"
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="lgpd_consent"
                    checked={data.lgpd_consent}
                    onChange={handleChange}
                />
                <span className="text-sm text-gray-600">
                    Concordo com os Termos e Política de Privacidade (LGPD) *
                </span>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full bg-[#FFD700] text-black font-semibold py-2.5 rounded-lg hover:opacity-90 transition"
                >
                    Próximo
                </button>
            </div>
        </form>
    );
}
