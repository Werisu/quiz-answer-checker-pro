import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { GroupMember, StudyGroup } from '@/hooks/useStudyGroups';
import {
    AlertTriangle,
    Crown,
    Settings,
    Shield,
    Trash2,
    User,
    Users
} from 'lucide-react';
import React, { useState } from 'react';

interface GroupMemberManagementProps {
  group: StudyGroup;
  currentUserRole: GroupMember['role'];
  onUpdateMemberRole: (memberId: string, newRole: GroupMember['role']) => Promise<boolean>;
  onRemoveMember: (memberId: string) => Promise<boolean>;
  onClose: () => void;
  loading?: boolean;
}

interface MemberStats {
  messages_sent: number;
  resources_shared: number;
  activities_count: number;
  last_active: string;
  join_date: string;
}

export const GroupMemberManagement: React.FC<GroupMemberManagementProps> = ({
  group,
  currentUserRole,
  onUpdateMemberRole,
  onRemoveMember,
  onClose,
  loading = false
}) => {
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const [newRole, setNewRole] = useState<GroupMember['role']>('member');
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [removingMember, setRemovingMember] = useState(false);

  const isAdmin = currentUserRole === 'admin';
  const isModerator = currentUserRole === 'moderator';
  const canManageMembers = isAdmin || isModerator;
  const canChangeRoles = isAdmin; // Apenas admins podem alterar roles

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
    },
    {
      id: 'member-4',
      user_id: 'user-4',
      group_id: group.id,
      role: 'member',
      joined_at: '2024-02-05T11:20:00Z',
      user_name: 'Ana Oliveira',
      user_email: 'ana@email.com'
    },
    {
      id: 'member-5',
      user_id: 'user-5',
      group_id: group.id,
      role: 'member',
      joined_at: '2024-02-10T16:45:00Z',
      user_name: 'Carlos Lima',
      user_email: 'carlos@email.com'
    }
  ];

  const mockMemberStats: Record<string, MemberStats> = {
    'member-1': {
      messages_sent: 45,
      resources_shared: 12,
      activities_count: 67,
      last_active: '2024-02-15T14:30:00Z',
      join_date: '2024-01-15T10:00:00Z'
    },
    'member-2': {
      messages_sent: 32,
      resources_shared: 8,
      activities_count: 45,
      last_active: '2024-02-15T12:15:00Z',
      join_date: '2024-01-20T14:30:00Z'
    },
    'member-3': {
      messages_sent: 18,
      resources_shared: 3,
      activities_count: 23,
      last_active: '2024-02-14T20:45:00Z',
      join_date: '2024-02-01T09:15:00Z'
    },
    'member-4': {
      messages_sent: 12,
      resources_shared: 2,
      activities_count: 15,
      last_active: '2024-02-13T18:20:00Z',
      join_date: '2024-02-05T11:20:00Z'
    },
    'member-5': {
      messages_sent: 8,
      resources_shared: 1,
      activities_count: 9,
      last_active: '2024-02-12T15:10:00Z',
      join_date: '2024-02-10T16:45:00Z'
    }
  };

  const handleRoleChange = (member: GroupMember) => {
    setSelectedMember(member);
    setNewRole(member.role);
    setShowRoleDialog(true);
  };

  const handleRemoveMember = (member: GroupMember) => {
    setSelectedMember(member);
    setShowRemoveDialog(true);
  };

  const confirmRoleChange = async () => {
    if (!selectedMember || !canChangeRoles) return;

    try {
      setUpdatingRole(true);
      const success = await onUpdateMemberRole(selectedMember.id, newRole);
      
      if (success) {
        console.log('✅ Role atualizado com sucesso!');
        setShowRoleDialog(false);
        setSelectedMember(null);
      } else {
        console.error('❌ Erro ao atualizar role');
      }
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
    } finally {
      setUpdatingRole(false);
    }
  };

  const confirmRemoveMember = async () => {
    if (!selectedMember || !canManageMembers) return;

    try {
      setRemovingMember(true);
      const success = await onRemoveMember(selectedMember.id);
      
      if (success) {
        console.log('✅ Membro removido com sucesso!');
        setShowRemoveDialog(false);
        setSelectedMember(null);
      } else {
        console.error('❌ Erro ao remover membro');
      }
    } catch (error) {
      console.error('Erro ao remover membro:', error);
    } finally {
      setRemovingMember(false);
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

  const canChangeMemberRole = (member: GroupMember) => {
    // Admins podem alterar qualquer role, exceto o próprio
    if (isAdmin && member.role !== 'admin') return true;
    // Moderadores não podem alterar roles
    return false;
  };

  const canRemoveMember = (member: GroupMember) => {
    // Admins podem remover qualquer membro, exceto o próprio
    if (isAdmin && member.role !== 'admin') return true;
    // Moderadores podem remover apenas membros comuns
    if (isModerator && member.role === 'member') return true;
    return false;
  };

  const getActivityLevel = (stats: MemberStats) => {
    const total = stats.messages_sent + stats.resources_shared + stats.activities_count;
    if (total >= 50) return { level: 'Alto', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' };
    if (total >= 25) return { level: 'Médio', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' };
    return { level: 'Baixo', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' };
  };

  const getLastActiveStatus = (lastActive: string) => {
    const lastActiveDate = new Date(lastActive);
    const now = new Date();
    const diffHours = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) return { status: 'Online', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' };
    if (diffHours < 24) return { status: 'Hoje', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' };
    if (diffHours < 168) return { status: 'Esta semana', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' };
    return { status: 'Inativo', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' };
  };

  if (!canManageMembers) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-600">Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para gerenciar membros deste grupo.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={onClose} variant="outline">
              Fechar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">
                    Gerenciar Membros
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {group.name} • {mockMembers.length} membros
                  </CardDescription>
                </div>
              </div>
              
              <Button onClick={onClose} variant="outline">
                Fechar
              </Button>
            </div>
          </CardHeader>

          {/* Conteúdo */}
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Estatísticas Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="text-center p-4">
                  <div className="text-2xl font-bold text-blue-600">{mockMembers.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total de Membros</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {mockMembers.filter(m => m.role === 'admin').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Admins</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {mockMembers.filter(m => m.role === 'moderator').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Moderadores</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {mockMembers.filter(m => m.role === 'member').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Membros</div>
                </Card>
              </div>

              {/* Lista de Membros */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Membros do Grupo
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {mockMembers.length} de {group.max_members} membros
                  </div>
                </div>

                <div className="space-y-3">
                  {mockMembers.map((member) => {
                    const stats = mockMemberStats[member.id];
                    const activityLevel = stats ? getActivityLevel(stats) : null;
                    const lastActiveStatus = stats ? getLastActiveStatus(stats.last_active) : null;
                    
                    return (
                      <Card key={member.id} className="p-4">
                        <div className="flex items-center justify-between">
                          {/* Informações do Membro */}
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {member.user_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {member.user_name}
                                </span>
                                {getRoleBadge(member.role)}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {member.user_email}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Entrou em {new Date(member.joined_at).toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          </div>

                          {/* Estatísticas */}
                          {stats && (
                            <div className="hidden md:flex items-center space-x-4">
                              <div className="text-center">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {stats.messages_sent}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Mensagens</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {stats.resources_shared}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Recursos</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {stats.activities_count}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Atividades</div>
                              </div>
                              <div className="text-center">
                                <Badge className={`text-xs ${activityLevel?.bg}`}>
                                  <span className={activityLevel?.color}>{activityLevel?.level}</span>
                                </Badge>
                              </div>
                              <div className="text-center">
                                <Badge className={`text-xs ${lastActiveStatus?.bg}`}>
                                  <span className={lastActiveStatus?.color}>{lastActiveStatus?.status}</span>
                                </Badge>
                              </div>
                            </div>
                          )}

                          {/* Ações */}
                          <div className="flex items-center space-x-2">
                            {canChangeMemberRole(member) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRoleChange(member)}
                                className="flex items-center space-x-1"
                              >
                                <Settings className="w-3 h-3" />
                                <span className="hidden sm:inline">Alterar Role</span>
                              </Button>
                            )}
                            
                            {canRemoveMember(member) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveMember(member)}
                                className="flex items-center space-x-1 text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span className="hidden sm:inline">Remover</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para Alterar Role */}
      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alterar Role do Membro</AlertDialogTitle>
            <AlertDialogDescription>
              Você está alterando o role de <strong>{selectedMember?.user_name}</strong> no grupo <strong>{group.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Novo Role:
            </label>
            <Select value={newRole} onValueChange={(value: GroupMember['role']) => setNewRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-green-600" />
                    <span>Membro</span>
                  </div>
                </SelectItem>
                <SelectItem value="moderator">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>Moderador</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-yellow-600" />
                    <span>Admin</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRoleChange}
              disabled={updatingRole || newRole === selectedMember?.role}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updatingRole ? 'Alterando...' : 'Confirmar Alteração'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog para Remover Membro */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Membro do Grupo</AlertDialogTitle>
            <AlertDialogDescription>
              Você está removendo <strong>{selectedMember?.user_name}</strong> do grupo <strong>{group.name}</strong>.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveMember}
              disabled={removingMember}
              className="bg-red-600 hover:bg-red-700"
            >
              {removingMember ? 'Removendo...' : 'Confirmar Remoção'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
