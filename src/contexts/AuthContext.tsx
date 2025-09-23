import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "firebase/auth";
import { onAuthStateChange, getCurrentUser } from "../services/auth";

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  checkAuthState: () => void; // ← Adicionar função manual
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("🔧 AuthContext: Inicializando listener de auth...");

    // Monitorar mudanças no estado de autenticação
    const unsubscribe = onAuthStateChange((user: User | null) => {
      console.log(
        "🔄 Estado de auth mudou:",
        user ? `Logado: ${user.email}` : "❌ Deslogado"
      );
      console.log("🔄 isAuthenticated será:", !!user);
      setUser(user);
      setIsLoading(false);
    });

    console.log("✅ AuthContext: Listener configurado");
    return unsubscribe; // Cleanup
  }, []);

  // Função para verificar manualmente o estado de autenticação
  const checkAuthState = () => {
    console.log("🔍 Verificação manual do estado de auth...");
    const currentUser = getCurrentUser();
    console.log("👤 getCurrentUser retornou:", currentUser?.email || "Nenhum");

    if (currentUser && !user) {
      console.log("🔧 Atualizando estado manualmente...");
      setUser(currentUser);
    } else if (!currentUser && user) {
      console.log("🔧 Limpando estado manualmente...");
      setUser(null);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    checkAuthState, // ← Adicionar função ao contexto
  };

  console.log("📊 AuthContext values:", {
    hasUser: !!user,
    userEmail: user?.email,
    isLoading,
    isAuthenticated: !!user,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
