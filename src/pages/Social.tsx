import { SocialDemo } from '@/components/SocialDemo';
import { AuthProvider } from '@/hooks/useAuth';

export default function SocialPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background/80">
        <div className="container mx-auto py-6">
          <SocialDemo />
        </div>
      </div>
    </AuthProvider>
  );
}
