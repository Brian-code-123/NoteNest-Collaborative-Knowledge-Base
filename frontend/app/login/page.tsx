import LoginPage from "./login";
import RouteGuard from "@/components/RouteGuard";

export default function Page() {
  return (
    <RouteGuard authOnly>
      <LoginPage />
    </RouteGuard>
  );
}
