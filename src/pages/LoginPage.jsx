import AuthScreen from "../components/AuthScreen.jsx";

export default function LoginPage({ onAuthenticated }) {
  return <AuthScreen onAuthenticated={onAuthenticated} />;
}