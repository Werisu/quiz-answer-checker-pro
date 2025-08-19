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
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile: sidebar fechada por padrão

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
    <div className={`flex flex-col lg:flex-row h-screen ${className}`}>
      {/* Sidebar Social - Responsivo */}
      {sidebarOpen && (
        <div className="w-full lg:w-80 flex-shrink-0 border-r border-border">
          <FriendsSidebar
            onFriendSelect={(friendId) => console.log('Amigo selecionado:', friendId)}
            onSendMessage={handleSendMessage}
            onViewProfile={handleViewProfile}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      )}
      
      {/* Conteúdo Principal */}
      <div className={`flex-1 overflow-auto lg:overflow-visible ${sidebarOpen ? 'hidden lg:block' : 'block'}`}>
        <div className="container mx-auto p-2 sm:p-3 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Indicador Mobile */}
          {sidebarOpen && (
            <div className="lg:hidden mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                📱 <strong>Sidebar Social ativa</strong> - Use o botão "Ver Conteúdo" para alternar
              </p>
            </div>
          )}
          {/* Header Responsivo */}
          <div className="flex flex-col sm:flex-row lg:flex-row lg:items-center lg:justify-between space-y-3 sm:space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold">🏠 Dashboard Social</h1>
              <p className="text-sm sm:text-base lg:text-xl text-muted-foreground">
                Gerencie suas conexões e atividades sociais
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-xs px-2 py-1"
              >
                {sidebarOpen ? '📱 Ver Conteúdo' : '👥 Ver Social'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex"
              >
                {sidebarOpen ? 'Ocultar Sidebar' : 'Mostrar Sidebar'}
              </Button>
            </div>
          </div>

          {/* Tabs principais - Responsivos */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4 lg:mt-0">

            <TabsList className="flex w-full overflow-x-auto gap-2 lg:gap-1 p-1 lg:p-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                             <TabsTrigger 
                 value="overview" 
                 className="flex items-center justify-center space-x-1 lg:space-x-2 text-sm lg:text-sm px-3 lg:px-3 py-3 lg:py-2 h-auto lg:h-auto min-h-[44px] lg:min-h-0 min-w-[120px] lg:min-w-0 rounded-lg lg:rounded-md transition-all duration-200 hover:bg-primary/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex-shrink-0"
               >
                <Activity className="h-4 w-4 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Visão Geral</span>
                <span className="sm:hidden">Geral</span>
              </TabsTrigger>
              
                             <TabsTrigger 
                 value="friends" 
                 className="flex items-center justify-center space-x-1 lg:space-x-2 text-sm lg:text-sm px-3 lg:px-3 py-3 lg:py-2 h-auto lg:h-auto min-h-[44px] lg:min-h-0 min-w-[120px] lg:min-w-0 rounded-lg lg:rounded-md transition-all duration-200 hover:bg-primary/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex-shrink-0"
               >
                <Users className="h-4 w-4 lg:h-4 lg:w-4" />
                <span>Amigos</span>
              </TabsTrigger>
              
                             <TabsTrigger 
                 value="groups" 
                 className="flex items-center justify-center space-x-1 lg:space-x-2 text-sm lg:text-sm px-3 lg:px-3 py-3 lg:py-2 h-auto lg:h-auto min-h-[44px] lg:min-h-0 min-w-[120px] lg:min-w-0 rounded-lg lg:rounded-md transition-all duration-200 hover:bg-primary/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex-shrink-0"
               >
                <BookOpen className="h-4 w-4 lg:h-4 lg:w-4" />
                <span>Grupos</span>
              </TabsTrigger>
              
                             <TabsTrigger 
                 value="chat" 
                 className="flex items-center justify-center space-x-1 lg:space-x-2 text-sm lg:text-sm px-3 lg:px-3 py-3 lg:py-2 h-auto lg:h-auto min-h-[44px] lg:min-h-0 min-w-[120px] lg:min-w-0 rounded-lg lg:rounded-md transition-all duration-200 hover:bg-primary/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex-shrink-0"
               >
                <MessageCircle className="h-4 w-4 lg:h-4 lg:w-4" />
                <span>Chat</span>
              </TabsTrigger>
              
                             <TabsTrigger 
                 value="achievements" 
                 className="flex items-center justify-center space-x-1 lg:space-x-2 text-sm lg:text-sm px-3 lg:px-3 py-3 lg:py-2 h-auto lg:h-auto min-h-[44px] lg:min-h-0 min-w-[120px] lg:min-w-0 rounded-lg lg:rounded-md transition-all duration-200 hover:bg-primary/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex-shrink-0"
               >
                <Trophy className="h-4 w-4 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Conquistas</span>
                <span className="sm:hidden">Conq.</span>
              </TabsTrigger>
            </TabsList>

            {/* Visão Geral */}
            <TabsContent value="overview" className="mt-6 lg:mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-4 mt-4 lg:mt-6">
                <Card className="p-2 lg:p-6">
                  <CardHeader className="pb-1 lg:pb-2 p-2 lg:p-6">
                    <CardTitle className="text-xs lg:text-sm font-medium flex items-center space-x-1 lg:space-x-2">
                      <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4" />
                      <span className="text-xs lg:text-sm">Engajamento</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 lg:p-6">
                    <div className="text-lg lg:text-2xl font-bold text-green-600">+24%</div>
                    <p className="text-xs text-muted-foreground">
                      Esta semana
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-2 lg:p-6">
                  <CardHeader className="pb-1 lg:pb-2 p-2 lg:p-6">
                    <CardTitle className="text-xs lg:text-sm font-medium flex items-center space-x-1 lg:space-x-2">
                      <Calendar className="h-3 w-3 lg:h-4 lg:w-4" />
                      <span className="text-xs lg:text-sm">Sessões</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 lg:p-6">
                    <div className="text-lg lg:text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">
                      Esta semana
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-2 lg:p-6">
                  <CardHeader className="pb-1 lg:pb-2 p-2 lg:p-6">
                    <CardTitle className="text-xs lg:text-sm font-medium flex items-center space-x-1 lg:space-x-2">
                      <Target className="h-3 w-3 lg:h-4 lg:w-4" />
                      <span className="text-xs lg:text-sm">Metas</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 lg:p-6">
                    <div className="text-lg lg:text-2xl font-bold text-blue-600">8/10</div>
                    <p className="text-xs text-muted-foreground">
                      Completadas
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-2 lg:p-6">
                  <CardHeader className="pb-1 lg:pb-2 p-2 lg:p-6">
                    <CardTitle className="text-xs lg:text-sm font-medium flex items-center space-x-1 lg:space-x-2">
                      <Trophy className="h-3 w-3 lg:h-4 lg:w-4" />
                      <span className="text-xs lg:text-sm">Pontos</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 lg:p-6">
                    <div className="text-lg lg:text-2xl font-bold text-purple-600">1,247</div>
                    <p className="text-xs text-muted-foreground">
                      Total acumulado
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Página de Amigos */}
            <TabsContent value="friends" className="mt-6 lg:mt-6">
              <FriendsList
                onSendMessage={handleSendMessage}
                onViewProfile={handleViewProfile}
              />
            </TabsContent>

            {/* Página de Grupos */}
            <TabsContent value="groups" className="mt-6 lg:mt-6">
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
            <TabsContent value="chat" className="mt-6 lg:mt-6">
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
            <TabsContent value="achievements" className="mt-6 lg:mt-6">
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
