import LoginForm from './components/login-form/login-form';

export default function Home() {
  return (
    <main className="flex-1 h-full min-h-0 flex items-center justify-center">
      <div>
        <h1 className="text-3xl leading-normal text-gray-900 dark:text-gray-200 text-center pb-4">
          Login
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
