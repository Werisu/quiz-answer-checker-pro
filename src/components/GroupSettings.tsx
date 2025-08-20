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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { GroupMember, StudyGroup } from '@/hooks/useStudyGroups';
import {
    AlertTriangle,
    Eye,
    EyeOff,
    FileText,
    Image,
    MessageSquare,
    Palette,
    Save,
    Settings,
    Shield,
    Trash2,
    UserPlus,
    X
} from 'lucide-react';
import React, { useState } from 'react';

interface GroupSettingsProps {
  group: StudyGroup;
  currentUserRole: GroupMember['role'];
  onUpdateGroup: (groupId: string, updates: Partial<StudyGroup>) => Promise<boolean>;
  onDeleteGroup: (groupId: string) => Promise<boolean>;
  onClose: () => void;
  loading?: boolean;
}

interface GroupConfig {
  privacy: {
    visibility: 'public' | 'private';
    allowInvites: boolean;
    requireApproval: boolean;
    showMemberList: boolean;
  };
  content: {
    allowFileSharing: boolean;
    allowLinks: boolean;
    maxFileSize: number;
    autoModeration: boolean;
    profanityFilter: boolean;
  };
  rules: {
    description: string;
    guidelines: string[];
    consequences: string;
  };
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
    customBanner?: string;
  };
  notifications: {
    newMemberAlert: boolean;
    activityDigest: boolean;
    weeklyReport: boolean;
    mentionNotifications: boolean;
  };
}

export const GroupSettings: React.FC<GroupSettingsProps> = ({
  group,
  currentUserRole,
  onUpdateGroup,
  onDeleteGroup,
  onClose,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState('privacy');
  const [config, setConfig] = useState<GroupConfig>({
    privacy: {
      visibility: group.visibility || 'public',
      allowInvites: true,
      requireApproval: false,
      showMemberList: true,
    },
    content: {
      allowFileSharing: true,
      allowLinks: true,
      maxFileSize: 10, // MB
      autoModeration: false,
      profanityFilter: true,
    },
    rules: {
      description: 'Respeite todos os membros e mantenha o foco nos estudos.',
      guidelines: [
        'Seja respeitoso com todos os membros',
        'Mantenha o foco nos temas de estudo',
        'Não compartilhe conteúdo inadequado',
        'Participe ativamente das discussões'
      ],
      consequences: 'Membros que violarem as regras podem ser advertidos ou removidos do grupo.'
    },
    appearance: {
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      logoUrl: '',
      customBanner: '',
    },
    notifications: {
      newMemberAlert: true,
      activityDigest: false,
      weeklyReport: true,
      mentionNotifications: true,
    }
  });

  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newGuideline, setNewGuideline] = useState('');

  const isAdmin = currentUserRole === 'admin';
  const canManageSettings = isAdmin;

  const handleSave = async () => {
    try {
      setSaving(true);
      const updates = {
        visibility: config.privacy.visibility,
        // Outros campos serão implementados quando a API suportar
      };
      
      const success = await onUpdateGroup(group.id, updates);
      if (success) {
        console.log('✅ Configurações salvas com sucesso!');
      } else {
        console.error('❌ Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      setDeleting(true);
      const success = await onDeleteGroup(group.id);
      if (success) {
        console.log('✅ Grupo deletado com sucesso!');
        onClose();
      } else {
        console.error('❌ Erro ao deletar grupo');
      }
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
    } finally {
      setDeleting(false);
    }
  };

  const addGuideline = () => {
    if (newGuideline.trim()) {
      setConfig(prev => ({
        ...prev,
        rules: {
          ...prev.rules,
          guidelines: [...prev.rules.guidelines, newGuideline.trim()]
        }
      }));
      setNewGuideline('');
    }
  };

  const removeGuideline = (index: number) => {
    setConfig(prev => ({
      ...prev,
      rules: {
        ...prev.rules,
        guidelines: prev.rules.guidelines.filter((_, i) => i !== index)
      }
    }));
  };

  const updateConfig = (section: keyof GroupConfig, key: string, value: string | number | boolean) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  if (!canManageSettings) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-600">Acesso Negado</CardTitle>
            <CardDescription>
              Apenas administradores podem configurar este grupo.
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
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">
                    Configurações do Grupo
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {group.name} • Personalize e configure seu grupo
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
                <Button onClick={onClose} variant="outline">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Conteúdo */}
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar de Navegação */}
              <div className="lg:col-span-1">
                <nav className="space-y-2">
                  {[
                    { id: 'privacy', label: 'Privacidade', icon: Eye, color: 'text-blue-600' },
                    { id: 'content', label: 'Conteúdo', icon: FileText, color: 'text-green-600' },
                    { id: 'rules', label: 'Regras', icon: Shield, color: 'text-purple-600' },
                    { id: 'appearance', label: 'Aparência', icon: Palette, color: 'text-pink-600' },
                    { id: 'notifications', label: 'Notificações', icon: MessageSquare, color: 'text-orange-600' },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                          isActive 
                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : tab.color}`} />
                        <span className={`font-medium ${isActive ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                </nav>

                {/* Ações Destrutivas */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Deletar Grupo
                    </Button>
                  </div>
                </div>
              </div>

              {/* Conteúdo Principal */}
              <div className="lg:col-span-3">
                {/* Tab: Privacidade */}
                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Configurações de Privacidade
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Controle quem pode ver e participar do seu grupo.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Visibilidade */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            {config.privacy.visibility === 'public' ? (
                              <Eye className="w-5 h-5 text-green-600" />
                            ) : (
                              <EyeOff className="w-5 h-5 text-orange-600" />
                            )}
                            <span>Visibilidade do Grupo</span>
                          </CardTitle>
                          <CardDescription>
                            Determine se o grupo é visível publicamente ou apenas para membros.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <Select
                              value={config.privacy.visibility}
                              onValueChange={(value: 'public' | 'private') => 
                                updateConfig('privacy', 'visibility', value)
                              }
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="public">
                                  <div className="flex items-center space-x-2">
                                    <Eye className="w-4 h-4 text-green-600" />
                                    <span>Público</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="private">
                                  <div className="flex items-center space-x-2">
                                    <EyeOff className="w-4 h-4 text-orange-600" />
                                    <span>Privado</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Badge variant={config.privacy.visibility === 'public' ? 'default' : 'secondary'}>
                              {config.privacy.visibility === 'public' ? 'Visível para todos' : 'Apenas membros'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Configurações de Convites */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <UserPlus className="w-5 h-5 text-blue-600" />
                            <span>Configurações de Convites</span>
                          </CardTitle>
                          <CardDescription>
                            Controle quem pode convidar novos membros para o grupo.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="allowInvites" className="text-sm font-medium">
                                Permitir convites
                              </Label>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Membros podem convidar outras pessoas
                              </p>
                            </div>
                            <Switch
                              id="allowInvites"
                              checked={config.privacy.allowInvites}
                              onCheckedChange={(checked) => 
                                updateConfig('privacy', 'allowInvites', checked)
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="requireApproval" className="text-sm font-medium">
                                Aprovação obrigatória
                              </Label>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Novos membros precisam ser aprovados
                              </p>
                            </div>
                            <Switch
                              id="requireApproval"
                              checked={config.privacy.requireApproval}
                              onCheckedChange={(checked) => 
                                updateConfig('privacy', 'requireApproval', checked)
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="showMemberList" className="text-sm font-medium">
                                Mostrar lista de membros
                              </Label>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Membros podem ver outros participantes
                              </p>
                            </div>
                            <Switch
                              id="showMemberList"
                              checked={config.privacy.showMemberList}
                              onCheckedChange={(checked) => 
                                updateConfig('privacy', 'showMemberList', checked)
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Tab: Conteúdo */}
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Configurações de Conteúdo
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Controle o que pode ser compartilhado e como o conteúdo é moderado.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Compartilhamento de Arquivos */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-green-600" />
                            <span>Compartilhamento de Arquivos</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="allowFileSharing" className="text-sm font-medium">
                                Permitir compartilhamento de arquivos
                              </Label>
                            </div>
                            <Switch
                              id="allowFileSharing"
                              checked={config.content.allowFileSharing}
                              onCheckedChange={(checked) => 
                                updateConfig('content', 'allowFileSharing', checked)
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="allowLinks" className="text-sm font-medium">
                                Permitir links externos
                              </Label>
                            </div>
                            <Switch
                              id="allowLinks"
                              checked={config.content.allowLinks}
                              onCheckedChange={(checked) => 
                                updateConfig('content', 'allowLinks', checked)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="maxFileSize" className="text-sm font-medium">
                              Tamanho máximo de arquivo (MB)
                            </Label>
                            <Input
                              id="maxFileSize"
                              type="number"
                              value={config.content.maxFileSize}
                              onChange={(e) => 
                                updateConfig('content', 'maxFileSize', parseInt(e.target.value))
                              }
                              className="w-32"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Moderação */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Shield className="w-5 h-5 text-purple-600" />
                            <span>Moderação de Conteúdo</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="autoModeration" className="text-sm font-medium">
                                Moderação automática
                              </Label>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Usar IA para detectar conteúdo inadequado
                              </p>
                            </div>
                            <Switch
                              id="autoModeration"
                              checked={config.content.autoModeration}
                              onCheckedChange={(checked) => 
                                updateConfig('content', 'autoModeration', checked)
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="profanityFilter" className="text-sm font-medium">
                                Filtro de palavrões
                              </Label>
                            </div>
                            <Switch
                              id="profanityFilter"
                              checked={config.content.profanityFilter}
                              onCheckedChange={(checked) => 
                                updateConfig('content', 'profanityFilter', checked)
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Tab: Regras */}
                {activeTab === 'rules' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Regras e Diretrizes do Grupo
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Defina as regras que todos os membros devem seguir.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Descrição das Regras */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Descrição Geral</CardTitle>
                          <CardDescription>
                            Uma visão geral das regras do grupo.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Textarea
                            placeholder="Descreva as regras gerais do grupo..."
                            value={config.rules.description}
                            onChange={(e) => 
                              updateConfig('rules', 'description', e.target.value)
                            }
                            rows={3}
                          />
                        </CardContent>
                      </Card>

                      {/* Diretrizes Específicas */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Diretrizes Específicas</CardTitle>
                          <CardDescription>
                            Lista de regras específicas que os membros devem seguir.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            {config.rules.guidelines.map((guideline, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                  {guideline}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeGuideline(index)}
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center space-x-3">
                            <Input
                              placeholder="Adicionar nova diretriz..."
                              value={newGuideline}
                              onChange={(e) => setNewGuideline(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && addGuideline()}
                            />
                            <Button onClick={addGuideline} size="sm">
                              Adicionar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Consequências */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Consequências</CardTitle>
                          <CardDescription>
                            O que acontece quando as regras são violadas.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Textarea
                            placeholder="Descreva as consequências de violar as regras..."
                            value={config.rules.consequences}
                            onChange={(e) => 
                              updateConfig('rules', 'consequences', e.target.value)
                            }
                            rows={3}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Tab: Aparência */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Personalização Visual
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Personalize a aparência do seu grupo.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Cores */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Palette className="w-5 h-5 text-pink-600" />
                            <span>Cores do Grupo</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="primaryColor">Cor Primária</Label>
                              <div className="flex items-center space-x-3">
                                <Input
                                  id="primaryColor"
                                  type="color"
                                  value={config.appearance.primaryColor}
                                  onChange={(e) => 
                                    updateConfig('appearance', 'primaryColor', e.target.value)
                                  }
                                  className="w-16 h-10 p-1"
                                />
                                <Input
                                  value={config.appearance.primaryColor}
                                  onChange={(e) => 
                                    updateConfig('appearance', 'primaryColor', e.target.value)
                                  }
                                  className="flex-1"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="secondaryColor">Cor Secundária</Label>
                              <div className="flex items-center space-x-3">
                                <Input
                                  id="secondaryColor"
                                  type="color"
                                  value={config.appearance.secondaryColor}
                                  onChange={(e) => 
                                    updateConfig('appearance', 'secondaryColor', e.target.value)
                                  }
                                  className="w-16 h-10 p-1"
                                />
                                <Input
                                  value={config.appearance.secondaryColor}
                                  onChange={(e) => 
                                    updateConfig('appearance', 'secondaryColor', e.target.value)
                                  }
                                  className="flex-1"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Preview */}
                          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <h4 className="text-sm font-medium mb-3">Preview das Cores</h4>
                            <div className="flex items-center space-x-4">
                              <div 
                                className="w-8 h-8 rounded-full"
                                style={{ backgroundColor: config.appearance.primaryColor }}
                              />
                              <div 
                                className="w-8 h-8 rounded-full"
                                style={{ backgroundColor: config.appearance.secondaryColor }}
                              />
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Estas cores serão aplicadas ao tema do grupo
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Logo e Banner */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Image className="w-5 h-5 text-blue-600" />
                            <span>Logo e Banner</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="logoUrl">URL do Logo</Label>
                            <Input
                              id="logoUrl"
                              placeholder="https://exemplo.com/logo.png"
                              value={config.appearance.logoUrl}
                              onChange={(e) => 
                                updateConfig('appearance', 'logoUrl', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="customBanner">URL do Banner Personalizado</Label>
                            <Input
                              id="customBanner"
                              placeholder="https://exemplo.com/banner.jpg"
                              value={config.appearance.customBanner}
                              onChange={(e) => 
                                updateConfig('appearance', 'customBanner', e.target.value)
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Tab: Notificações */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Configurações de Notificações
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Controle quais notificações você recebe sobre o grupo.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <MessageSquare className="w-5 h-5 text-orange-600" />
                            <span>Preferências de Notificação</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="newMemberAlert" className="text-sm font-medium">
                                Alertas de novos membros
                              </Label>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Notificar quando alguém entrar no grupo
                              </p>
                            </div>
                            <Switch
                              id="newMemberAlert"
                              checked={config.notifications.newMemberAlert}
                              onCheckedChange={(checked) => 
                                updateConfig('notifications', 'newMemberAlert', checked)
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="activityDigest" className="text-sm font-medium">
                                Resumo de atividades
                              </Label>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Receber resumo diário das atividades
                              </p>
                            </div>
                            <Switch
                              id="activityDigest"
                              checked={config.notifications.activityDigest}
                              onCheckedChange={(checked) => 
                                updateConfig('notifications', 'activityDigest', checked)
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="weeklyReport" className="text-sm font-medium">
                                Relatório semanal
                              </Label>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Receber relatório semanal do grupo
                              </p>
                            </div>
                            <Switch
                              id="weeklyReport"
                              checked={config.notifications.weeklyReport}
                              onCheckedChange={(checked) => 
                                updateConfig('notifications', 'weeklyReport', checked)
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="mentionNotifications" className="text-sm font-medium">
                                Notificações de menções
                              </Label>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Notificar quando você for mencionado
                              </p>
                            </div>
                            <Switch
                              id="mentionNotifications"
                              checked={config.notifications.mentionNotifications}
                              onCheckedChange={(checked) => 
                                updateConfig('notifications', 'mentionNotifications', checked)
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para Deletar Grupo */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Grupo</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a deletar o grupo <strong>{group.name}</strong>. 
              Esta ação não pode ser desfeita e todos os membros serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deletando...' : 'Confirmar Deletar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
