import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GroupMember, StudyGroup } from '@/hooks/useStudyGroups';
import {
    BookOpen,
    Calendar,
    Crown,
    Eye,
    EyeOff,
    LogOut,
    Settings,
    Shield,
    Tag,
    User,
    UserPlus,
    Users
} from 'lucide-react';
import React from 'react';

interface GroupCardProps {
  group: StudyGroup;
  userRole?: GroupMember['role'];
  onViewGroup: (groupId: string) => void;
  onManageGroup: (groupId: string) => void;
  onInviteMembers: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
  onJoinGroup: (groupId: string) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  userRole,
  onViewGroup,
  onManageGroup,
  onInviteMembers,
  onLeaveGroup,
  onJoinGroup
}) => {
  const isOwner = userRole === 'admin';
  const isModerator = userRole === 'moderator';
  const isMember = userRole === 'member';
  const isNotMember = !userRole;

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

  const getVisibilityIcon = () => {
    return group.visibility === 'public' ? (
      <Eye className="w-4 h-4 text-green-600" />
    ) : (
      <EyeOff className="w-4 h-4 text-orange-600" />
    );
  };

  const getVisibilityLabel = () => {
    return group.visibility === 'public' ? 'Público' : 'Privado';
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

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 bg-white dark:bg-gray-900">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {group.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {group.description}
              </CardDescription>
            </div>
          </div>
          
          {/* Badge de Status */}
          <div className="flex items-center space-x-2">
            {userRole && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                {getRoleIcon(userRole)}
                <span className="text-xs">{getRoleLabel(userRole)}</span>
              </Badge>
            )}
            <Badge 
              variant="outline" 
              className={`flex items-center space-x-1 ${getMemberCountBg()}`}
            >
              {getVisibilityIcon()}
              <span className="text-xs">{getVisibilityLabel()}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informações do Grupo */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <div className="text-sm">
              <span className={`font-medium ${getMemberCountColor()}`}>
                {group.member_count}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                /{group.max_members} membros
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Criado em {new Date(group.created_at).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Tags */}
        {group.tags && group.tags.length > 0 && (
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <div className="flex flex-wrap gap-1">
              {group.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                >
                  {tag}
                </Badge>
              ))}
              {group.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  +{group.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Barra de Progresso de Membros */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Capacidade do grupo</span>
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

        {/* Ações do Grupo */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {/* Botão Ver Grupo */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewGroup(group.id)}
              className="flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Ver Grupo</span>
            </Button>

            {/* Botões baseados no papel do usuário */}
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
          </div>

          <div className="flex items-center space-x-2">
            {/* Botão Sair/Entrar */}
            {isMember || isOwner || isModerator ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLeaveGroup(group.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                disabled={isOwner} // Dono não pode sair
              >
                <LogOut className="w-4 h-4 mr-1" />
                {isOwner ? 'Dono' : 'Sair'}
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => onJoinGroup(group.id)}
                disabled={group.member_count >= group.max_members}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                {group.member_count >= group.max_members ? 'Cheio' : 'Entrar'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
