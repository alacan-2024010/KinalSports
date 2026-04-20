import { useEffect, useState } from "react";
import { useUserManagementStore } from "../../users/store/useUserManagmentSotre.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { showError, showSuccess } from "../../../shared/utils/toast.js";
import { CreateUserModal } from "./CreateUserModal.jsx";
import { useAuthStore } from "../../auth/store/authStore.js";
import { UserDetailModal } from "./UserDetailModal.jsx";

export const Users = () => {

    const { users, loading, error, fetchUsers } = useUserManagementStore();
    const registerUser = useAuthStore((state) => state.register);

    const [search, setSearch] = useState("");
    const [roleFilter, setFilter] = useState("ALL");
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenDetail = (user) => {
        setSelectedUser(user);
    };

    const handleCreate = async (formData) => {
        const res = await registerUser(formData);

        if (res.success) {
            showSuccess("Usuario creado. Se envió correo de verificación.");
            await fetchUsers(undefined, { force: true });
            setOpenCreateModal(false);
            return true;
        }

        showError(res.error || "No se pudo crear el usuario");
        return false;
    };

    if (loading && users.length === 0) return <Spinner />;

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-main-blue">Usuarios</h1>
                    <p className="text-gray-500 text-sm">
                        Administra usuarios, consulta su información y cambia su rol
                    </p>
                </div>

                <button
                    className="bg-main-blue px-4 py-2 rounded text-white hover:opacity-90 transition"
                    onClick={() => setOpenCreateModal(true)}
                >
                    + Agregar Usuario
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                        placeholder="Buscar por nombre o username..."
                        className="md:col-span-2 w-full px-3 py-2 border rounded-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="w-full px-3 py-2 border rounded-lg"
                        value={roleFilter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">Todos los roles</option>
                        <option value="ADMIN_ROLE">ADMIN_ROLE</option>
                        <option value="USER_ROLE">USER_ROLE</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="text-left px-4 py-3">Nombre</th>
                                <th className="text-left px-4 py-3">Username</th>
                                <th className="text-left px-4 py-3">Rol</th>
                                <th className="text-right px-4 py-3">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>
                                        No hay usuarios para mostrar.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {[u.name, u.surname].filter(Boolean).join(" ") || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            @{u.username}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                u.role === "ADMIN_ROLE"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                className="px-3 py-1.5 rounded-lg bg-main-blue text-white text-xs font-semibold hover:opacity-90"
                                                onClick={() => handleOpenDetail(u)}
                                            >
                                                Ver / Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateUserModal
                isOpen={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onCreate={handleCreate}
                loading={loading}
                error={error}
            />

            <UserDetailModal
                key={selectedUser?.id || "no-user"}
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                user={selectedUser}
                loading={loading}
            />
        </div>
    );
};