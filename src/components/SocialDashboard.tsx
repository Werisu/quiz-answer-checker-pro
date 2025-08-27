import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLoading } from '@/contexts/LoadingContext';
import { useAchievements } from '@/hooks/useAchievements';
import { useActiveChat } from '@/hooks/useActiveChat';
import { useAuth } from '@/hooks/useAuth';
import { useFriends } from '@/hooks/useFriends';
import type { StudyGroup } from '@/hooks/useStudyGroups';
import { useStudyGroups } from '@/hooks/useStudyGroups';
import {
    Activity,
    ArrowLeft,
    BookOpen,
    Calendar,
    MessageCircle,
    Plus,
    Search,
    Settings,
    TrendingUp,
    Trophy,
    Users
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AchievementStats } from './AchievementStats';
import { ChatRoom } from './ChatRoom';
import { ChatSelector } from './ChatSelector';
import { CreateGroupModal } from './CreateGroupModal';
import { ExploreGroups } from './ExploreGroups';
import { FriendsList } from './FriendsList';
import { FriendsListSkeleton } from './FriendsListSkeleton';
import { GroupDetails } from './GroupDetails';
import { GroupInviteModal } from './GroupInviteModal';
import { GroupList } from './GroupList';
import { GroupListSkeleton } from './GroupListSkeleton';
import { GroupMemberManagement } from './GroupMemberManagement';
import { GroupSettings } from './GroupSettings';
import { HeaderSkeleton } from './HeaderSkeleton';
import { NewChatModal } from './NewChatModal';
import { NotificationsDropdown } from './NotificationsDropdown';
import { PerformanceMonitor } from './PerformanceMonitor';
import { QuickStatsSkeleton } from './QuickStatsSkeleton';
import { SocialWidget } from './SocialWidget';
import { SocialWidgetSkeleton } from './SocialWidgetSkeleton';
import { StatsCardsSkeleton } from './StatsCardsSkeleton';

interface SocialDashboardProps {
  className?: string;
}

export const SocialDashboard: React.FC<SocialDashboardProps> = ({
  className = ''
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [showExploreGroups, setShowExploreGroups] = useState(false);
  const [groupDetailsOpen, setGroupDetailsOpen] = useState(false);
  const [selectedGroupForDetails, setSelectedGroupForDetails] = useState<StudyGroup | null>(null);
  const [memberManagementOpen, setMemberManagementOpen] = useState(false);
  const [selectedGroupForManagement, setSelectedGroupForManagement] = useState<StudyGroup | null>(null);
  const [groupSettingsOpen, setGroupSettingsOpen] = useState(false);
  const [selectedGroupForSettings, setSelectedGroupForSettings] = useState<StudyGroup | null>(null);
  
  // Chat ativo
  const { activeChat, startChat, closeChat, selectExistingChat, conversations } = useActiveChat();
  
  // Modal de nova conversa
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  
  // Usar o LoadingContext global para controlar loading states
  const { setLoading, isLoading } = useLoading();
  
  // Usar dados reais do hook useFriends
  const { 
    friends, 
    pendingRequests, 
    acceptFriendRequest, 
    rejectFriendRequest,
    loading 
  } = useFriends();

  // Usar dados reais do hook useStudyGroups
  const {
    groups,
    loading: groupsLoading,
    error: groupsError,
    createGroup,
    joinGroup,
    leaveGroup,
    acceptInvitation,
    rejectInvitation,
    inviteUser,
    removeMember,
    updateMemberRole,
  } = useStudyGroups();

  // Usar dados reais do hook useAuth para pegar o userId
  const { user } = useAuth();

  // Usar dados reais do hook useAchievements
  const {
    goalAchievements,
    challengeAchievements,
    loading: achievementsLoading,
    calculateProgress
  } = useAchievements();

  // Calcular progresso dos achievements
  const progress = calculateProgress();

  const handleGoBack = () => {
    navigate('/');
  };

  const handleSendMessage = (friendId: string) => {
    console.log('Enviar mensagem para:', friendId);
  };

  const handleViewProfile = (userId: string) => {
    console.log('Ver perfil de:', userId);
  };

  const handleAcceptRequest = async (requestId: string) => {
    console.log('Aceitar solicitação:', requestId);
    const success = await acceptFriendRequest(requestId);
    if (success) {
      console.log('✅ Solicitação aceita com sucesso!');
      // O hook useFriends já atualiza automaticamente as listas
    } else {
      console.error('❌ Erro ao aceitar solicitação');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    console.log('Rejeitar solicitação:', requestId);
    const success = await rejectFriendRequest(requestId);
    if (success) {
      console.log('✅ Solicitação rejeitada com sucesso!');
      // O hook useFriends já atualiza automaticamente as listas
    } else {
      console.error('❌ Erro ao rejeitar solicitação');
    }
  };

  const handleViewAllFriends = () => {
    setActiveTab('friends');
  };

  const handleViewRequests = () => {
    setActiveTab('friends');
  };

  // Funções para gerenciamento de grupos
  const handleCreateGroup = () => {
    setCreateGroupModalOpen(true);
  };

  const handleCreateGroupSubmit = async (groupData: {
    name: string;
    description: string;
    visibility: 'public' | 'private';
    max_members: number;
    tags: string[];
  }) => {
    console.log('Criando grupo:', groupData);
    const success = await createGroup(groupData);
    
    if (success) {
      console.log('✅ Grupo criado com sucesso!');
    } else {
      console.error('❌ Erro ao criar grupo');
    }
    
    return success;
  };

  const handleJoinGroup = async (groupId: string): Promise<boolean> => {
    console.log('Entrar no grupo:', groupId);
    const success = await joinGroup(groupId);
    if (success) {
      console.log('✅ Entrou no grupo com sucesso!');
    } else {
      console.error('❌ Erro ao entrar no grupo');
    }
    return success;
  };

  const handleViewGroup = (groupId: string) => {
    console.log('Ver grupo:', groupId);
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroupForDetails(group);
      setGroupDetailsOpen(true);
    }
  };



  const handleManageGroup = (groupId: string) => {
    console.log('Gerenciar grupo:', groupId);
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroupForManagement(group);
      setMemberManagementOpen(true);
    }
  };

  const handleGroupSettings = (groupId: string) => {
    console.log('Configurações do grupo:', groupId);
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroupForSettings(group);
      setGroupSettingsOpen(true);
    }
  };

  const updateGroup = async (groupId: string, updates: Partial<StudyGroup>) => {
    try {
      // TODO: Implementar atualização do grupo na API
      console.log('Atualizando grupo:', groupId, updates);
      // Por enquanto, apenas simular sucesso
      return true;
    } catch (error) {
      console.error('Erro ao atualizar grupo:', error);
      return false;
    }
  };

  const deleteGroup = async (groupId: string) => {
    try {
      // TODO: Implementar deleção do grupo na API
      console.log('Deletando grupo:', groupId);
      // Por enquanto, apenas simular sucesso
      return true;
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
      return false;
    }
  };

  const handleLeaveGroup = async (groupId: string): Promise<boolean> => {
    console.log('Sair do grupo:', groupId);
    const success = await leaveGroup(groupId);
    if (success) {
      console.log('✅ Saiu do grupo com sucesso!');
    } else {
      console.error('❌ Erro ao sair do grupo');
    }
    return success;
  };

  const handleInviteMembers = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
      setInviteModalOpen(true);
    }
  };

  // Funções de gerenciamento do chat
  const handleStartNewChat = () => {
    setNewChatModalOpen(true);
  };

  const handleStartChat = async (type: 'private' | 'group', targetId: string, name?: string) => {
    await startChat(type, targetId, name);
  };

  const handleSelectChat = (conversationId: string) => {
    selectExistingChat(conversationId);
  };

  const handleCloseChat = () => {
    closeChat();
  };

  // Usar loading states reais dos hooks
  const isHeaderLoading = loading || groupsLoading || achievementsLoading;
  const isStatsLoading = loading || groupsLoading;
  const isSocialWidgetLoading = loading;
  const isAchievementsLoading = achievementsLoading;
  const isFriendsLoading = loading;
  const isGroupsLoading = groupsLoading;

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* MOBILE FIRST - Header Principal */}
      {isHeaderLoading ? (
        <HeaderSkeleton />
      ) : (
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 lg:hidden">
          <div className="px-4 py-3">
            {/* Header Mobile */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGoBack}
                  className="w-10 h-10 p-0 rounded-full bg-gray-100 dark:bg-gray-800 mr-2"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Button>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">S</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">Social</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
                </div>
              </div>
              
                             <div className="flex items-center space-x-2">
                 <NotificationsDropdown
                   onAcceptRequest={handleAcceptRequest}
                   onRejectRequest={handleRejectRequest}
                   onViewProfile={handleViewProfile}
                   onSendMessage={handleSendMessage}
                   onMarkAsRead={(id) => console.log('Marcar como lida:', id)}
                   onDismiss={(id) => console.log('Dispensar:', id)}
                   friends={friends}
                   pendingRequests={pendingRequests}
                 />
               </div>
            </div>
          </div>
        </header>
      )}

      {/* MOBILE FIRST - Conteúdo Principal */}
      <main className="px-4 py-6 lg:hidden">
        {/* Cards de Estatísticas - Mobile First */}
        {isStatsLoading ? (
          <StatsCardsSkeleton />
        ) : (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
              <div className="text-2xl font-bold">
                {friends.length}
              </div>
              <div className="text-xs opacity-90">Amigos</div>
            </div>
                         <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white">
               <div className="text-2xl font-bold">
                 {groups.length}
               </div>
               <div className="text-xs opacity-90">Grupos</div>
             </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white">
              <div className="text-2xl font-bold">
                {pendingRequests.length}
              </div>
              <div className="text-xs opacity-90">Pendentes</div>
            </div>
          </div>
        )}

        {/* Barra de Ações - Mobile First */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl"
            onClick={handleCreateGroup}
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
                <CardContent className="px-0">
                  {isSocialWidgetLoading ? (
                    <SocialWidgetSkeleton />
                  ) : (
                    <SocialWidget
                      onViewAllFriends={handleViewAllFriends}
                      onSendMessage={handleSendMessage}
                      onViewProfile={handleViewProfile}
                      onViewRequests={handleViewRequests}
                    />
                  )}
                </CardContent>
              </Card>



                             {/* Estatísticas de Conquistas */}
               {!achievementsLoading && (
                 <Card className="bg-white dark:bg-gray-900 border-0 shadow-sm rounded-2xl">
                   <CardHeader className="pb-4">
                     <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center space-x-2">
                       <Trophy className="w-5 h-5 text-yellow-600" />
                       <span>Suas Conquistas</span>
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="px-0">
                     <AchievementStats progress={progress} />
                   </CardContent>
                 </Card>
               )}

               {/* Estatísticas Rápidas */}
               {isStatsLoading ? (
                 <QuickStatsSkeleton />
               ) : (
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
                         <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                           <Calendar className="w-6 h-6 text-white" />
                         </div>
                         <div>
                           <div className="text-lg font-bold text-green-600 dark:text-green-400">12</div>
                           <div className="text-xs text-green-600/70 dark:text-green-400/70">Sessões</div>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 </div>
               )}

               {/* Performance Monitor */}
               <PerformanceMonitor />
            </div>
          )}

          {/* Tab: Amigos */}
          {activeTab === 'friends' && (
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-sm rounded-2xl">
              <CardContent className="p-0">
                {isFriendsLoading ? (
                  <FriendsListSkeleton />
                ) : (
                  <FriendsList
                    onSendMessage={handleSendMessage}
                    onViewProfile={handleViewProfile}
                  />
                )}
              </CardContent>
            </Card>
          )}

                     {/* Tab: Grupos */}
           {activeTab === 'groups' && (
             <div className="space-y-6">
               {/* Header com botões de ação */}
               <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                     {showExploreGroups ? 'Explorar Grupos Públicos' : 'Meus Grupos de Estudo'}
                   </h2>
                   <p className="text-gray-600 dark:text-gray-400 mt-1">
                     {showExploreGroups 
                       ? 'Descubra e participe de grupos incríveis'
                       : `${groups.length} grupos • Gerencie suas participações`
                     }
                   </p>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row gap-3">
                   {!showExploreGroups && (
                     <Button onClick={handleCreateGroup} className="bg-green-600 hover:bg-green-700">
                       <Plus className="w-4 h-4 mr-2" />
                       Criar Grupo
                     </Button>
                   )}
                   <Button 
                     variant={showExploreGroups ? "default" : "outline"}
                     onClick={() => setShowExploreGroups(!showExploreGroups)}
                     className={showExploreGroups ? "bg-blue-600 hover:bg-blue-700" : ""}
                   >
                     <Search className="w-4 h-4 mr-2" />
                     {showExploreGroups ? 'Meus Grupos' : 'Explorar Grupos'}
                   </Button>
                 </div>
               </div>

                               {/* Conteúdo baseado no estado */}
                {isGroupsLoading ? (
                  <GroupListSkeleton />
                ) : showExploreGroups ? (
                  <ExploreGroups
                    onJoinGroup={handleJoinGroup}
                    onViewGroup={handleViewGroup}
                    loading={groupsLoading}
                  />
                ) : (
                  <GroupList
                    groups={groups}
                    loading={groupsLoading}
                    onCreateGroup={handleCreateGroup}
                    onJoinGroup={handleJoinGroup}
                    onViewGroup={handleViewGroup}
                    onManageGroup={handleManageGroup}
                    onLeaveGroup={handleLeaveGroup}
                    onInviteMembers={handleInviteMembers}
                  />
                )}
             </div>
           )}

          {/* Tab: Chat */}
          {activeTab === 'chat' && (
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-sm rounded-2xl">
              <CardContent className="p-0">
                {activeChat ? (
                  <ChatRoom 
                    roomId={activeChat.roomId}
                    roomType={activeChat.roomType}
                    participants={activeChat.participants}
                    onClose={handleCloseChat}
                  />
                ) : (
                  <ChatSelector
                    conversations={conversations}
                    onSelectChat={handleSelectChat}
                    onStartNewChat={handleStartNewChat}
                    loading={false}
                  />
                )}
              </CardContent>
            </Card>
          )}

                     {/* Tab: Conquistas */}
           {activeTab === 'achievements' && (
             <Card className="bg-white dark:bg-gray-900 border-0 shadow-sm rounded-2xl">
               <CardContent className="p-0">
                 {achievementsLoading ? (
                   <div className="p-8 text-center">
                     <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                       <Trophy className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Carregando conquistas...</h3>
                   </div>
                 ) : (
                   <div className="p-6">
                     <AchievementStats progress={progress} />
                   </div>
                 )}
               </CardContent>
             </Card>
           )}
        </div>
      </main>

      

      {/* DESKTOP - Adaptação Mobile First */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="w-10 h-10 p-0 rounded-full bg-gray-100 dark:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Social</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Gerencie suas conexões e atividades sociais
                </p>
              </div>
            </div>
            
                                      <div className="flex items-center space-x-4">
               <NotificationsDropdown
                 onAcceptRequest={handleAcceptRequest}
                 onRejectRequest={handleRejectRequest}
                 onViewProfile={handleViewProfile}
                 onSendMessage={handleSendMessage}
                 onMarkAsRead={(id) => console.log('Marcar como lida:', id)}
                 onDismiss={(id) => console.log('Dispensar:', id)}
                 friends={friends}
                 pendingRequests={pendingRequests}
               />
             </div>
          </div>

          <div className="w-full">
            {/* Conteúdo Principal Desktop */}
            <div className="w-full">
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
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-4">
                                          {isSocialWidgetLoading ? (
                      <SocialWidgetSkeleton />
                    ) : (
                        <SocialWidget
                          onViewAllFriends={handleViewAllFriends}
                          onSendMessage={handleSendMessage}
                          onViewProfile={handleViewProfile}
                          onViewRequests={handleViewRequests}
                        />
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="friends">
                  {isFriendsLoading ? (
                    <FriendsListSkeleton />
                  ) : (
                    <FriendsList
                      onSendMessage={handleSendMessage}
                      onViewProfile={handleViewProfile}
                    />
                  )}
                </TabsContent>

                                 <TabsContent value="groups">
                   <div className="space-y-6">
                     {/* Header com botões de ação */}
                     <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                       <div>
                         <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                           {showExploreGroups ? 'Explorar Grupos Públicos' : 'Meus Grupos de Estudo'}
                         </h2>
                         <p className="text-gray-600 dark:text-gray-400 mt-1">
                           {showExploreGroups 
                             ? 'Descubra e participe de grupos incríveis'
                             : `${groups.length} grupos • Gerencie suas participações`
                           }
                         </p>
                       </div>
                       
                       <div className="flex flex-col sm:flex-row gap-3">
                         {!showExploreGroups && (
                           <Button onClick={handleCreateGroup} className="bg-green-600 hover:bg-green-700">
                             <Plus className="w-4 h-4 mr-2" />
                             Criar Grupo
                           </Button>
                         )}
                         <Button 
                           variant={showExploreGroups ? "default" : "outline"}
                           onClick={() => setShowExploreGroups(!showExploreGroups)}
                           className={showExploreGroups ? "bg-blue-600 hover:bg-blue-700" : ""}
                         >
                           <Search className="w-4 h-4 mr-2" />
                           {showExploreGroups ? 'Meus Grupos' : 'Explorar Grupos'}
                         </Button>
                       </div>
                     </div>

                     {/* Conteúdo baseado no estado */}
                     {isGroupsLoading ? (
                       <GroupListSkeleton />
                     ) : showExploreGroups ? (
                       <ExploreGroups
                         onJoinGroup={handleJoinGroup}
                         onViewGroup={handleViewGroup}
                         loading={groupsLoading}
                       />
                     ) : (
                       <GroupList
                         groups={groups}
                         loading={groupsLoading}
                         onCreateGroup={handleCreateGroup}
                         onJoinGroup={handleJoinGroup}
                         onViewGroup={handleViewGroup}
                         onManageGroup={handleManageGroup}
                         onLeaveGroup={handleLeaveGroup}
                         onInviteMembers={handleInviteMembers}
                         onGroupSettings={handleGroupSettings}
                       />
                     )}
                   </div>
                 </TabsContent>

                <TabsContent value="chat">
                  <div className="h-[600px] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                    {activeChat ? (
                      <ChatRoom 
                        roomId={activeChat.roomId}
                        roomType={activeChat.roomType}
                        participants={activeChat.participants}
                        onClose={handleCloseChat}
                      />
                    ) : (
                      <ChatSelector
                        conversations={conversations}
                        onSelectChat={handleSelectChat}
                        onStartNewChat={handleStartNewChat}
                        loading={false}
                      />
                    )}
                  </div>
                </TabsContent>

                                 <TabsContent value="achievements">
                   <AchievementStats progress={progress} />
                 </TabsContent>
              </Tabs>
                         </div>
           </div>
        </div>
      </div>

      {/* Modal de Criação de Grupo */}
      <CreateGroupModal
        isOpen={createGroupModalOpen}
        onClose={() => setCreateGroupModalOpen(false)}
        onSubmit={handleCreateGroupSubmit}
        loading={groupsLoading}
      />

      {/* Modal de Convite de Usuários */}
      {selectedGroup && (
        <GroupInviteModal
          isOpen={inviteModalOpen}
          onClose={() => {
            setInviteModalOpen(false);
            setSelectedGroup(null);
          }}
          group={selectedGroup}
          onInviteUser={inviteUser}
          loading={groupsLoading}
        />
      )}

      {/* Modal de Detalhes do Grupo */}
      {selectedGroupForDetails && (
        <GroupDetails
          group={selectedGroupForDetails}
          userRole={selectedGroupForDetails.user_role}
          onJoinGroup={handleJoinGroup}
          onLeaveGroup={handleLeaveGroup}
          onManageGroup={handleManageGroup}
          onInviteMembers={handleInviteMembers}
          onClose={() => {
            setGroupDetailsOpen(false);
            setSelectedGroupForDetails(null);
          }}
          loading={groupsLoading}
        />
      )}

      {/* Modal de Gerenciamento de Membros */}
      {selectedGroupForManagement && (
                                <GroupMemberManagement
                          group={selectedGroupForManagement}
                          currentUserRole={selectedGroupForManagement.user_role}
                          onUpdateMemberRole={(memberId: string, newRole: 'admin' | 'moderator' | 'member') => 
                            updateMemberRole(selectedGroupForManagement.id, memberId, newRole)
                          }
                          onRemoveMember={(memberId: string) => 
                            removeMember(selectedGroupForManagement.id, memberId)
                          }
                          onClose={() => {
                            setMemberManagementOpen(false);
                            setSelectedGroupForManagement(null);
                          }}
                          loading={groupsLoading}
                        />
      )}

      {/* Modal de Configurações do Grupo */}
      {selectedGroupForSettings && (
        <GroupSettings
          group={selectedGroupForSettings}
          currentUserRole={selectedGroupForSettings.user_role}
          onUpdateGroup={updateGroup}
          onDeleteGroup={deleteGroup}
          onClose={() => {
            setGroupSettingsOpen(false);
            setSelectedGroupForSettings(null);
          }}
          loading={groupsLoading}
        />
      )}

      {/* Modal de Nova Conversa */}
      <NewChatModal
        isOpen={newChatModalOpen}
        onClose={() => setNewChatModalOpen(false)}
        onStartChat={handleStartChat}
        friends={friends}
        groups={groups}
        loading={false}
      />
    </div>
  );
};
