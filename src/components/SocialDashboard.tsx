import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Activity,
    BookOpen,
    Calendar,
    MessageCircle,
    Target,
    TrendingUp,
    Trophy,
    Users
} from 'lucide-react';
import React, { useState } from 'react';
import { FriendsList } from './FriendsList';
import { FriendsSidebar } from './FriendsSidebar';
import { SocialNotifications } from './SocialNotifications';
import { SocialWidget } from './SocialWidget';

interface SocialDashboardProps {
  className?: string;
}

export const SocialDashboard: React.FC<SocialDashboardProps> = ({
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSendMessage = (friendId: string) => {
    console.log('Enviar mensagem para:', friendId);
    // Implementar navegação para chat
  };

  const handleViewProfile = (userId: string) => {
    console.log('Ver perfil de:', userId);
    // Implementar navegação para perfil
  };

  const handleAcceptRequest = (requestId: string) => {
    console.log('Aceitar solicitação:', requestId);
    // Implementar lógica de aceitar solicitação
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Rejeitar solicitação:', requestId);
    // Implementar lógica de rejeitar solicitação
  };

  const handleViewAllFriends = () => {
    setActiveTab('friends');
  };

  const handleViewRequests = () => {
    setActiveTab('friends');
    // Focar na aba de solicitações
  };

  return (
    <div className={`flex h-screen ${className}`}>
      {/* Sidebar Social */}
      {sidebarOpen && (
        <FriendsSidebar
          onFriendSelect={(friendId) => console.log('Amigo selecionado:', friendId)}
          onSendMessage={handleSendMessage}
          onViewProfile={handleViewProfile}
        />
      )}
      
      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">🏠 Dashboard Social</h1>
              <p className="text-xl text-muted-foreground">
                Gerencie suas conexões e atividades sociais
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? 'Ocultar Sidebar' : 'Mostrar Sidebar'}
              </Button>
            </div>
          </div>

          {/* Tabs principais */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Visão Geral</span>
              </TabsTrigger>
              
              <TabsTrigger value="friends" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Amigos</span>
              </TabsTrigger>
              
              <TabsTrigger value="groups" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Grupos</span>
              </TabsTrigger>
              
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Chat</span>
              </TabsTrigger>
              
              <TabsTrigger value="achievements" className="flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>Conquistas</span>
              </TabsTrigger>
            </TabsList>

            {/* Visão Geral */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Widget Social */}
                <div className="lg:col-span-2">
                  <SocialWidget
                    onViewAllFriends={handleViewAllFriends}
                    onSendMessage={handleSendMessage}
                    onViewProfile={handleViewProfile}
                    onViewRequests={handleViewRequests}
                  />
                </div>
                
                {/* Notificações */}
                <div>
                  <SocialNotifications
                    onAcceptRequest={handleAcceptRequest}
                    onRejectRequest={handleRejectRequest}
                    onViewProfile={handleViewProfile}
                    onSendMessage={handleSendMessage}
                  />
                </div>
              </div>

              {/* Estatísticas Sociais */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Engajamento</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">+24%</div>
                    <p className="text-xs text-muted-foreground">
                      Esta semana
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Sessões</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">
                      Esta semana
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>Metas</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">8/10</div>
                    <p className="text-xs text-muted-foreground">
                      Completadas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <Trophy className="h-4 w-4" />
                      <span>Pontos</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">1,247</div>
                    <p className="text-xs text-muted-foreground">
                      Total acumulado
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Página de Amigos */}
            <TabsContent value="friends" className="mt-6">
              <FriendsList
                onSendMessage={handleSendMessage}
                onViewProfile={handleViewProfile}
              />
            </TabsContent>

            {/* Página de Grupos */}
            <TabsContent value="groups" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grupos de Estudo</CardTitle>
                  <CardDescription>
                    Funcionalidade em desenvolvimento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Grupos em breve!</h3>
                    <p className="text-muted-foreground">
                      O sistema de grupos de estudo está sendo implementado.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Página de Chat */}
            <TabsContent value="chat" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sistema de Chat</CardTitle>
                  <CardDescription>
                    Funcionalidade em desenvolvimento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Chat em breve!</h3>
                    <p className="text-muted-foreground">
                      O sistema de chat está sendo implementado.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Página de Conquistas */}
            <TabsContent value="achievements" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conquistas Sociais</CardTitle>
                  <CardDescription>
                    Funcionalidade em desenvolvimento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Conquistas em breve!</h3>
                    <p className="text-muted-foreground">
                      O sistema de conquistas está sendo implementado.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
