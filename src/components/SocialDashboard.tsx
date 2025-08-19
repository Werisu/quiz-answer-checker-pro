import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Bell,
  BookOpen,
  Calendar,
  MessageCircle,
  Plus,
  Search,
  Settings,
  TrendingUp,
  Trophy,
  Users,
  X
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Dados mock para demonstração
  const friends = [
    { id: '1', name: 'João Silva', is_online: true, last_seen: new Date().toISOString() },
    { id: '2', name: 'Maria Santos', is_online: false, last_seen: new Date(Date.now() - 3600000).toISOString() },
    { id: '3', name: 'Pedro Costa', is_online: true, last_seen: new Date().toISOString() }
  ];
  
  const pendingRequests = [
    { id: '1', requester_name: 'Ana Oliveira' },
    { id: '2', requester_name: 'Carlos Lima' }
  ];

  const handleSendMessage = (friendId: string) => {
    console.log('Enviar mensagem para:', friendId);
  };

  const handleViewProfile = (userId: string) => {
    console.log('Ver perfil de:', userId);
  };

  const handleAcceptRequest = (requestId: string) => {
    console.log('Aceitar solicitação:', requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Rejeitar solicitação:', requestId);
  };

  const handleViewAllFriends = () => {
    setActiveTab('friends');
  };

  const handleViewRequests = () => {
    setActiveTab('friends');
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* MOBILE FIRST - Header Principal */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 lg:hidden">
        <div className="px-4 py-3">
          {/* Header Mobile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">S</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Social</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full bg-gray-100 dark:bg-gray-800"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full bg-gray-100 dark:bg-gray-800"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE FIRST - Conteúdo Principal */}
      <main className="px-4 py-6 lg:hidden">
        {/* Cards de Estatísticas - Mobile First */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
            <div className="text-2xl font-bold">{friends.length}</div>
            <div className="text-xs opacity-90">Amigos</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white">
            <div className="text-2xl font-bold">{friends.filter(f => f.is_online).length}</div>
            <div className="text-xs opacity-90">Online</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white">
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <div className="text-xs opacity-90">Pendentes</div>
          </div>
        </div>

        {/* Barra de Ações - Mobile First */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 p-0 rounded-full bg-gray-100 dark:bg-gray-800"
            >
              <Search className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 p-0 rounded-full bg-gray-100 dark:bg-gray-800"
            >
              <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </Button>
          </div>
        </div>

        {/* Tabs Mobile First */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-1 mb-6 shadow-sm">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Geral', icon: Activity, color: 'from-blue-500 to-blue-600' },
              { id: 'friends', label: 'Amigos', icon: Users, color: 'from-purple-500 to-purple-600' },
              { id: 'groups', label: 'Grupos', icon: BookOpen, color: 'from-green-500 to-green-600' },
              { id: 'chat', label: 'Chat', icon: MessageCircle, color: 'from-pink-500 to-pink-600' },
              { id: 'achievements', label: 'Conq.', icon: Trophy, color: 'from-yellow-500 to-yellow-600' }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive 
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 mx-auto mb-1 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conteúdo das Tabs - Mobile First */}
        <div className="space-y-6">
          {/* Tab: Visão Geral */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Widget de Atividade Social */}
              <Card className="bg-white dark:bg-gray-900 border-0 shadow-sm rounded-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-gray-900 dark:text-white">Atividade Social</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleViewAllFriends}
                      className="text-blue-600 dark:text-blue-400 text-sm"
                    >
                      Ver todos
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <SocialWidget
                    onViewAllFriends={handleViewAllFriends}
                    onSendMessage={handleSendMessage}
                    onViewProfile={handleViewProfile}
                    onViewRequests={handleViewRequests}
                  />
                </CardContent>
              </Card>

              {/* Widget de Notificações */}
              <Card className="bg-white dark:bg-gray-900 border-0 shadow-sm rounded-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-gray-900 dark:text-white">Notificações</CardTitle>
                    <Badge variant="secondary" className="bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      2 novas
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <SocialNotifications
                    onAcceptRequest={handleAcceptRequest}
                    onRejectRequest={handleRejectRequest}
                    onViewProfile={handleViewProfile}
                    onSendMessage={handleSendMessage}
                  />
                </CardContent>
              </Card>

              {/* Estatísticas Rápidas */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0 shadow-sm rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">+24%</div>
                        <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Engajamento</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-0 shadow-sm rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">12</div>
                        <div className="text-xs text-green-600/70 dark:text-green-400/70">Sessões</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Tab: Amigos */}
          {activeTab === 'friends' && (
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-sm rounded-2xl">
              <CardContent className="p-0">
                <FriendsList
                  onSendMessage={handleSendMessage}
                  onViewProfile={handleViewProfile}
                />
              </CardContent>
            </Card>
          )}

          {/* Tab: Grupos */}
          {activeTab === 'groups' && (
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-sm rounded-2xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Grupos em breve!</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    O sistema de grupos de estudo está sendo implementado.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab: Chat */}
          {activeTab === 'chat' && (
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-sm rounded-2xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/20 dark:to-pink-800/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <MessageCircle className="w-10 h-10 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Chat em breve!</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    O sistema de chat está sendo implementado.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab: Conquistas */}
          {activeTab === 'achievements' && (
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-sm rounded-2xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Conquistas em breve!</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    O sistema de conquistas está sendo implementado.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Sidebar Mobile - Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl">
            <FriendsSidebar
              onFriendSelect={(friendId) => console.log('Amigo selecionado:', friendId)}
              onSendMessage={handleSendMessage}
              onViewProfile={handleViewProfile}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* DESKTOP - Adaptação Mobile First */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Social</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Gerencie suas conexões e atividades sociais
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? 'Ocultar Sidebar' : 'Mostrar Sidebar'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Conteúdo Principal Desktop */}
            <div className={`${sidebarOpen ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
              {/* Tabs Desktop */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-6">
                  <TabsTrigger value="overview" className="flex items-center space-x-2">
                    <Activity className="w-4 h-4" />
                    <span>Visão Geral</span>
                  </TabsTrigger>
                  <TabsTrigger value="friends" className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Amigos</span>
                  </TabsTrigger>
                  <TabsTrigger value="groups" className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Grupos</span>
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat</span>
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4" />
                    <span>Conquistas</span>
                  </TabsTrigger>
                </TabsList>

                {/* Conteúdo das Tabs Desktop */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <SocialWidget
                        onViewAllFriends={handleViewAllFriends}
                        onSendMessage={handleSendMessage}
                        onViewProfile={handleViewProfile}
                        onViewRequests={handleViewRequests}
                      />
                    </div>
                    <div>
                      <SocialNotifications
                        onAcceptRequest={handleAcceptRequest}
                        onRejectRequest={handleRejectRequest}
                        onViewProfile={handleViewProfile}
                        onSendMessage={handleSendMessage}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="friends">
                  <FriendsList
                    onSendMessage={handleSendMessage}
                    onViewProfile={handleViewProfile}
                  />
                </TabsContent>

                <TabsContent value="groups">
                  <Card>
                    <CardHeader>
                      <CardTitle>Grupos de Estudo</CardTitle>
                      <CardDescription>Funcionalidade em desenvolvimento</CardDescription>
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

                <TabsContent value="chat">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sistema de Chat</CardTitle>
                      <CardDescription>Funcionalidade em desenvolvimento</CardDescription>
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

                <TabsContent value="achievements">
                  <Card>
                    <CardHeader>
                      <CardTitle>Conquistas Sociais</CardTitle>
                      <CardDescription>Funcionalidade em desenvolvimento</CardDescription>
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

            {/* Sidebar Desktop */}
            {sidebarOpen && (
              <div className="lg:col-span-1">
                <FriendsSidebar
                  onFriendSelect={(friendId) => console.log('Amigo selecionado:', friendId)}
                  onSendMessage={handleSendMessage}
                  onViewProfile={handleViewProfile}
                  onClose={() => setSidebarOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
