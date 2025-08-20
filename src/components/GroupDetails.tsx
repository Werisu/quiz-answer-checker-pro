import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GroupMember, StudyGroup } from '@/hooks/useStudyGroups';
import {
    ArrowLeft,
    BookOpen,
    Crown,
    Eye,
    EyeOff,
    FileText,
    Link,
    Loader2,
    LogOut,
    MessageCircle,
    Settings,
    Shield,
    User,
    UserPlus,
    Users
} from 'lucide-react';
import React, { useState } from 'react';

interface GroupDetailsProps {
  group: StudyGroup;
  userRole?: GroupMember['role'];
  onJoinGroup: (groupId: string) => Promise<boolean>;
  onLeaveGroup: (groupId: string) => Promise<boolean>;
  onManageGroup: (groupId: string) => void;
  onInviteMembers: (groupId: string) => void;
  onClose: () => void;
  loading?: boolean;
}

interface GroupActivity {
  id: string;
  type: 'member_joined' | 'member_left' | 'resource_shared' | 'message_sent';
  description: string;
  user_name: string;
  timestamp: string;
  icon: React.ReactNode;
}

interface SharedResource {
  id: string;
  name: string;
  type: 'document' | 'link' | 'file';
  description: string;
  shared_by: string;
  shared_at: string;
  icon: React.ReactNode;
}

export const GroupDetails: React.FC<GroupDetailsProps> = ({
  group,
  userRole,
  onJoinGroup,
  onLeaveGroup,
  onManageGroup,
  onInviteMembers,
  onClose,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [joiningGroup, setJoiningGroup] = useState(false);
  const [leavingGroup, setLeavingGroup] = useState(false);

  const isOwner = userRole === 'admin';
  const isModerator = userRole === 'moderator';
  const isMember = userRole === 'member';
  const isNotMember = !userRole;

  // Mock de dados (será substituído por API real)
  const mockMembers: GroupMember[] = [
    {
      id: 'member-1',
      user_id: 'user-1',
      group_id: group.id,
      role: 'admin',
      joined_at: '2024-01-15T10:00:00Z',
      user_name: 'João Silva',
      user_email: 'joao@email.com'
    },
    {
      id: 'member-2',
      user_id: 'user-2',
      group_id: group.id,
      role: 'moderator',
      joined_at: '2024-01-20T14:30:00Z',
      user_name: 'Maria Santos',
      user_email: 'maria@email.com'
    },
    {
      id: 'member-3',
      user_id: 'user-3',
      group_id: group.id,
      role: 'member',
      joined_at: '2024-02-01T09:15:00Z',
      user_name: 'Pedro Costa',
      user_email: 'pedro@email.com'
    }
  ];

  const mockActivities: GroupActivity[] = [
    {
      id: 'activity-1',
      type: 'member_joined',
      description: 'Pedro Costa entrou no grupo',
      user_name: 'Pedro Costa',
      timestamp: '2024-02-01T09:15:00Z',
      icon: <UserPlus className="w-4 h-4 text-green-600" />
    },
    {
      id: 'activity-2',
      type: 'resource_shared',
      description: 'Maria Santos compartilhou um documento',
      user_name: 'Maria Santos',
      timestamp: '2024-01-25T16:45:00Z',
      icon: <FileText className="w-4 h-4 text-blue-600" />
    },
    {
      id: 'activity-3',
      type: 'message_sent',
      description: 'João Silva enviou uma mensagem',
      user_name: 'João Silva',
      timestamp: '2024-01-22T11:20:00Z',
      icon: <MessageCircle className="w-4 h-4 text-purple-600" />
    }
  ];

  const mockResources: SharedResource[] = [
    {
      id: 'resource-1',
      name: 'Apostila de Matemática',
      type: 'document',
      description: 'Material completo para estudo',
      shared_by: 'Maria Santos',
      shared_at: '2024-01-25T16:45:00Z',
      icon: <FileText className="w-4 h-4 text-blue-600" />
    },
    {
      id: 'resource-2',
      name: 'Link para Videoaulas',
      type: 'link',
      description: 'Playlist de vídeos explicativos',
      shared_by: 'João Silva',
      shared_at: '2024-01-20T10:30:00Z',
      icon: <Link className="w-4 h-4 text-green-600" />
    }
  ];

  const handleJoinGroup = async () => {
    try {
      setJoiningGroup(true);
      const success = await onJoinGroup(group.id);
      if (success) {
        // Fechar modal após entrar com sucesso
        onClose();
      }
    } catch (error) {
      console.error('Erro ao entrar no grupo:', error);
    } finally {
      setJoiningGroup(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      setLeavingGroup(true);
      const success = await onLeaveGroup(group.id);
      if (success) {
        // Fechar modal após sair com sucesso
        onClose();
      }
    } catch (error) {
      console.error('Erro ao sair do grupo:', error);
    } finally {
      setLeavingGroup(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'member':
        return <User className="w-4 h-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'moderator':
        return 'Moderador';
      case 'member':
        return 'Membro';
      default:
        return '';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Admin</Badge>;
      case 'moderator':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Moderador</Badge>;
      case 'member':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Membro</Badge>;
      default:
        return null;
    }
  };

  const getMemberCountColor = () => {
    const percentage = (group.member_count / group.max_members) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    return 'text-green-600';
  };

  const getMemberCountBg = () => {
    const percentage = (group.member_count / group.max_members) * 100;
    if (percentage >= 90) return 'bg-red-100 dark:bg-red-900/20';
    if (percentage >= 75) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-green-100 dark:bg-green-900/20';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Carregando detalhes do grupo...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Aguarde enquanto buscamos as informações
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-8 h-8 p-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  {group.name}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {group.description}
                </CardDescription>
              </div>
            </div>
            
            {/* Ações do usuário */}
            <div className="flex items-center space-x-3">
              {isMember || isOwner || isModerator ? (
                <>
                  {(isOwner || isModerator) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onInviteMembers(group.id)}
                      className="flex items-center space-x-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Convidar</span>
                    </Button>
                  )}
                  
                  {isOwner && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onManageGroup(group.id)}
                      className="flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Gerenciar</span>
                    </Button>
                  )}
                  
                  {!isOwner && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLeaveGroup}
                      disabled={leavingGroup}
                      className="flex items-center space-x-2 text-red-600 border-red-600 hover:bg-red-50"
                    >
                      {leavingGroup ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      <span>Sair</span>
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleJoinGroup}
                  disabled={joiningGroup || group.member_count >= group.max_members}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {joiningGroup ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  <span className="ml-2">
                    {group.member_count >= group.max_members ? 'Grupo Cheio' : 'Entrar'}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Conteúdo */}
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-gray-200 dark:border-gray-700">
              <TabsTrigger value="overview" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="members" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                Membros ({mockMembers.length})
              </TabsTrigger>
              <TabsTrigger value="activities" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                Atividades
              </TabsTrigger>
              <TabsTrigger value="resources" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                Recursos
              </TabsTrigger>
            </TabsList>

            {/* Tab: Visão Geral */}
            <TabsContent value="overview" className="p-6 space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5" />
                      <span>Informações do Grupo</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Visibilidade:</span>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        {group.visibility === 'public' ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-orange-600" />
                        )}
                        <span>{group.visibility === 'public' ? 'Público' : 'Privado'}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Criado em:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {new Date(group.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Tags:</span>
                      <div className="flex flex-wrap gap-1">
                        {group.tags && group.tags.length > 0 ? (
                          group.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">Nenhuma tag</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Estatísticas</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Membros:</span>
                      <span className={`text-sm font-medium ${getMemberCountColor()}`}>
                        {group.member_count}/{group.max_members}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Capacidade</span>
                        <span>{Math.round((group.member_count / group.max_members) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            (group.member_count / group.max_members) >= 0.9
                              ? 'bg-red-500'
                              : (group.member_count / group.max_members) >= 0.75
                              ? 'bg-orange-500'
                              : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min((group.member_count / group.max_members) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Atividades:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {mockActivities.length} hoje
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Descrição Completa */}
              <Card>
                <CardHeader>
                  <CardTitle>Sobre este grupo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {group.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Membros */}
            <TabsContent value="members" className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Membros do Grupo
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {mockMembers.length} de {group.max_members} membros
                  </span>
                </div>

                <div className="space-y-3">
                  {mockMembers.map((member) => (
                    <Card key={member.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {member.user_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {member.user_name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {member.user_email}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {getRoleBadge(member.role)}
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Entrou em {new Date(member.joined_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab: Atividades */}
            <TabsContent value="activities" className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Atividades Recentes
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Últimas {mockActivities.length} atividades
                  </span>
                </div>

                <div className="space-y-3">
                  {mockActivities.map((activity) => (
                    <Card key={activity.id} className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {activity.description}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            por {activity.user_name}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(activity.timestamp).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab: Recursos */}
            <TabsContent value="resources" className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recursos Compartilhados
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {mockResources.length} recursos
                  </span>
                </div>

                <div className="space-y-3">
                  {mockResources.map((resource) => (
                    <Card key={resource.id} className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          {resource.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {resource.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {resource.description}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Compartilhado por {resource.shared_by}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(resource.shared_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
