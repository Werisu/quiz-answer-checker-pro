import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, MessageCircle, Trophy, Users } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface SocialNavigationProps {
  className?: string;
}

export const SocialNavigation: React.FC<SocialNavigationProps> = ({
  className = ''
}) => {
  return (
    <Card className={`p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-800 ${className}`}>
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Sistema Social
          </h2>
          <p className="text-muted-foreground">
            Conecte-se com outros estudantes, participe de grupos e colabore
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-white/60 dark:bg-white/10 rounded-xl">
            <Users className="w-5 h-5 mx-auto text-blue-500 mb-1" />
            <div className="text-sm font-semibold">Amigos</div>
            <div className="text-xs text-muted-foreground">Conexões</div>
          </div>
          
          <div className="text-center p-3 bg-white/60 dark:bg-white/10 rounded-xl">
            <MessageCircle className="w-5 h-5 mx-auto text-green-500 mb-1" />
            <div className="text-sm font-semibold">Chat</div>
            <div className="text-xs text-muted-foreground">Comunicação</div>
          </div>
          
          <div className="text-center p-3 bg-white/60 dark:bg-white/10 rounded-xl">
            <BookOpen className="w-5 h-5 mx-auto text-purple-500 mb-1" />
            <div className="text-sm font-semibold">Grupos</div>
            <div className="text-xs text-muted-foreground">Colaboração</div>
          </div>
          
          <div className="text-center p-3 bg-white/60 dark:bg-white/10 rounded-xl">
            <Trophy className="w-5 h-5 mx-auto text-orange-500 mb-1" />
            <div className="text-sm font-semibold">Conquistas</div>
            <div className="text-xs text-muted-foreground">Gamificação</div>
          </div>
        </div>

        <Link to="/social">
          <Button className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-base">
            <Users className="w-5 h-5 mr-2" />
            Acessar Dashboard Social
          </Button>
        </Link>
      </div>
    </Card>
  );
};
