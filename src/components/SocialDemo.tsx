import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, MessageCircle, Trophy, Users } from 'lucide-react';
import React from 'react';
import { FriendsList } from './FriendsList';

export const SocialDemo: React.FC = () => {
  const handleSendMessage = (friendId: string) => {
    console.log('Enviar mensagem para:', friendId);
    // Implementar navegação para chat
  };

  const handleViewProfile = (userId: string) => {
    console.log('Ver perfil de:', userId);
    // Implementar navegação para perfil
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">🚀 Sistema Social</h1>
        <p className="text-xl text-muted-foreground">
          Demonstração do sistema de amigos, grupos e chat
        </p>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Amigos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Chats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 não lidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Grupos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">3 ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Conquistas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 esta semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principais */}
      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="friends" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Amigos</span>
            <Badge variant="secondary" className="ml-1">12</Badge>
          </TabsTrigger>
          
          <TabsTrigger value="groups" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Grupos</span>
            <Badge variant="secondary" className="ml-1">5</Badge>
          </TabsTrigger>
          
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Chat</span>
            <Badge variant="destructive" className="ml-1">2</Badge>
          </TabsTrigger>
          
          <TabsTrigger value="activities" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>Atividades</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="mt-6">
          <FriendsList
            onSendMessage={handleSendMessage}
            onViewProfile={handleViewProfile}
          />
        </TabsContent>

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

        <TabsContent value="activities" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Sociais</CardTitle>
              <CardDescription>
                Funcionalidade em desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Atividades em breve!</h3>
                <p className="text-muted-foreground">
                  O sistema de atividades está sendo implementado.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Informações de desenvolvimento */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">📋 Status de Desenvolvimento</CardTitle>
          <CardDescription>
            Sistema de Amigos - Fase 1
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span>✅ FriendsList Component</span>
            <Badge variant="default">Completo</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>✅ FriendCard Component</span>
            <Badge variant="default">Completo</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>✅ FriendRequestCard Component</span>
            <Badge variant="default">Completo</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>✅ AddFriendModal Component</span>
            <Badge variant="default">Completo</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>✅ useFriends Hook</span>
            <Badge variant="default">Completo</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>⏳ FriendsSidebar Component</span>
            <Badge variant="secondary">Próximo</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
