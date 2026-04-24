import { useEffect, useMemo, useState } from "react"
import { useUserManagementStore } from "../store/useUserManagmentSotre.js"
import { Spinner } from "../../../shared/components/layout/Spinner.jsx"
import { showError, showSuccess } from "../../../shared/utils/toast.js"
import { CreateUserModal } from "./CreateUserModal.jsx"
import { useAuthStore } from "../../auth/store/authStore.js"
import { UserDetailModal } from "./UserDetailModal.jsx"

const PAGE_SIZE = 8;

function getInitials(name = "", surname = "") {
    return [name[0], surname[0]].filter(Boolean).join("").toUpperCase() || "?";
}

export const Users = () => {

    const { users, loading, error, fetchUsers, updateUserRole } = useUserManagementStore();
    const registerUser = useAuthStore((state) => state.register);
    const currentUser = useAuthStore((state) => state.user);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);
    useEffect(() => { if (error) showError(error); }, [error]);

    const filtered = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return users.filter((u) =>{
            const fullName = `${u.name ||  " "}  ${u.surname || " "}`
            .trim()
            .toLowerCase();

            const username = (u.username || "").toLowerCase();
            const role = (u.role || "").toUpperCase();

            const matchesSearch =
                !normalizedSearch ||
                fullName.includes(normalizedSearch) ||
                username.includes(normalizedSearch);

            const matchesRole =
                roleFilter === "ALL" ? true : role === roleFilter.toUpperCase();
            
                return matchesSearch && matchesRole;
        })
    }, [users, search, roleFilter]);

    //ceil sirve para redondear
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    //Evitar que el usuario no vaya a una pagina que no tiene nada
    const currentPage = Math.min(page, totalPages);
   
    const paginatedUsers = useMemo(() => {
        const start = (currentPage -1) * PAGE_SIZE;
        //slice sirve para partir el arreglo en 2
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, currentPage]);

    const handleSaveRole = async (user, newRole) => {
        const res = await updateUserRole(user.id, newRole);
        if (res.success) {
            showSuccess("Rol actualizado correctamente");
            setOpenDetailModal(false);
            setSelectedUser(null);
        } else {
            showError(res.error || "No se pudo actualizar el rol.");
        }
    };

    const handleOpenDetail = (user) => {
        setSelectedUser(user);
        setOpenDetailModal(true);
    };

    const handleCreate = async (formData) => {
        const res = await registerUser(formData);
        if (res.success) {
            showSuccess("Usuario creado. Se envió correo de verificación.");
            await fetchUsers(undefined, { force: true });
            return true;
        }
        showError(res.error || "No se pudo crear el usuario");
        return false;
    };

    if (loading && users.length === 0) return <Spinner />;

    return (
        <div className="p-6">

            {/* Acento decorativo */}
            <div className="w-7 h-0.5 bg-blue-700 rounded-full mb-4" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div>
                    <h1 className="font-serif text-2xl font-normal text-gray-900 mb-0.5">
                        Usuarios
                    </h1>
                    <p className="text-xs text-gray-400">
                        Administra usuarios, consulta su información y cambia su rol
                    </p>
                </div>

                <button
                    onClick={() => setOpenCreateModal(true)}
                    className="bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white text-sm
                               font-medium px-4 py-2.5 rounded-lg transition-all duration-150 whitespace-nowrap"
                >
                    + Agregar Usuario
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                        value={search}
                        onChange={(e) => { 
                            setSearch(e.target.value)
                            setPage(1); 
                        }}
                        placeholder="Buscar por nombre o username..."
                        className="md:col-span-2 w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200
                                   rounded-lg placeholder:text-gray-300 focus:outline-none focus:border-blue-600
                                   focus:ring-2 focus:ring-blue-100 transition-all duration-150"
                    />
                    <select
                        value={roleFilter}
                        onChange={(e) => { 
                            setRoleFilter(e.target.value)
                            setPage(1); 
                        }}
                        className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200
                                   rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2
                                   focus:ring-blue-100 transition-all duration-150 text-gray-700"
                    >
                        <option value="ALL">Todos los roles</option>
                        <option value="ADMIN_ROLE">ADMIN_ROLE</option>
                        <option value="USER_ROLE">USER_ROLE</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">

                        <thead className="bg-gray-50">
                            <tr>
                                {["Nombre", "Username", "Rol"].map((h) => (
                                    <th key={h} className="text-left px-4 py-3 text-[10px] font-medium
                                                           uppercase tracking-widest text-gray-400">
                                        {h}
                                    </th>
                                ))}
                                <th className="text-right px-4 py-3 text-[10px] font-medium
                                               uppercase tracking-widest text-gray-400">
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">
                                        No hay usuarios para mostrar.
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((u) => (
                                    <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors duration-100">

                                        {/* Nombre con avatar */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center
                                                                justify-center text-[11px] font-medium text-blue-700 shrink-0">
                                                    {getInitials(u.name, u.surname)}
                                                </div>
                                                <span className="font-medium text-gray-800">
                                                    {[u.name, u.surname].filter(Boolean).join(" ") || "-"}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-gray-400 text-xs">
                                            @{u.username}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium
                                                ${u.role === "ADMIN_ROLE"
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "bg-gray-100 text-gray-500"
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleOpenDetail(u)}
                                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium
                                                           text-gray-600 hover:bg-gray-50 hover:border-gray-300
                                                           transition-all duration-150"
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

                {/* Paginación */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50 bg-gray-50">
                    <p className="text-xs text-gray-400">
                        Mostrando  { " " }
                        {(currentPage - 1) *  PAGE_SIZE + (paginatedUsers.length ? 1 : 0)}
                        {" - "}
                        {(currentPage - 1) * PAGE_SIZE + paginatedUsers.length} de{" "}
                        {filtered.length} usuarios
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p)=> Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 rounded border bg-white text-sm"
                        >
                            Anterior
                        </button>

                        <span className="text-xs text-gray-400 min-w-[40px] text-center">
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick = {() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 rounded border bg-white text-sm"
                        >
                            Siguiente
                        </button>
                    </div>
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
                isOpen={openDetailModal}
                onClose={() => { setOpenDetailModal(false); setSelectedUser(null); }}
                user={selectedUser}
                loading={loading}
                onSaveRole={handleSaveRole}
                currentUserId={currentUser?.id}
            />
        </div>
    );
};