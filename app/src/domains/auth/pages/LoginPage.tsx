import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center p-4" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#2D6A4F] mb-2">Gimoreni</h1>
          <p className="text-gray-500">Sign in to manage your points and quests.</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};
