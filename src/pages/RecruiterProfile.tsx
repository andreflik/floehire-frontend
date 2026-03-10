import { useEffect, useState } from "react";
import { API_URL } from "../services/api";
import { useAuth } from "../contexts/useAuth";
import { toast } from "sonner";

type RecruiterProfile = {
    company_name: string;
    email: string;
    website?: string;
    linkedin?: string;
    location?: string;
    description?: string;
    logo_url?: string;
};

export default function RecruiterProfile() {

    const { auth } = useAuth();

    const [profile, setProfile] = useState<RecruiterProfile | null>(null);
    const [loading, setLoading] = useState(true);

    async function loadProfile() {

        try {

            const res = await fetch(`${API_URL}/recruiter/profile`, {
                headers: {
                    Authorization: `Bearer ${auth?.access_token}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "Erro ao carregar perfil");
            }

            setProfile(data);

        } catch (err: any) {

            toast.error(err.message);

        } finally {

            setLoading(false);

        }

    }

    async function updateProfile() {

        if (!profile) return;

        try {

            const res = await fetch(`${API_URL}/recruiter/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth?.access_token}`
                },
                body: JSON.stringify(profile)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "Erro ao atualizar perfil");
            }

            toast.success("Perfil atualizado com sucesso");

        } catch (err: any) {

            toast.error(err.message);

        }

    }

    useEffect(() => {
        loadProfile();
    }, []);

    if (loading) {
        return <div className="p-6">Carregando perfil...</div>;
    }

    if (!profile) {
        return null;
    }

    return (
        <div className="max-w-3xl mx-auto p-6">

            <h1 className="text-2xl font-bold mb-6">
                Perfil da Empresa
            </h1>

            <div className="space-y-4">

                {/* Empresa */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Nome da empresa
                    </label>

                    <input
                        value={profile.company_name}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                company_name: e.target.value
                            })
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Email
                    </label>

                    <input
                        value={profile.email}
                        disabled
                        className="w-full border rounded-lg px-4 py-2 bg-gray-100"
                    />
                </div>

                {/* Website */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Website
                    </label>

                    <input
                        value={profile.website || ""}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                website: e.target.value
                            })
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                {/* LinkedIn */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        LinkedIn
                    </label>

                    <input
                        value={profile.linkedin || ""}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                linkedin: e.target.value
                            })
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                {/* Localização */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Localização
                    </label>

                    <input
                        value={profile.location || ""}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                location: e.target.value
                            })
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                {/* Descrição */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Sobre a empresa
                    </label>

                    <textarea
                        rows={4}
                        value={profile.description || ""}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                description: e.target.value
                            })
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                {/* Botão salvar */}
                <div className="pt-4">

                    <button
                        onClick={updateProfile}
                        className="
              bg-[#FFD700]
              text-black
              font-semibold
              px-6 py-2
              rounded-lg
              hover:opacity-90
              transition
            "
                    >
                        Salvar alterações
                    </button>

                </div>

            </div>

        </div>
    );
}