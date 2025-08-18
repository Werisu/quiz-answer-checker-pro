# 📅 Calendário de Estudos - EstudaPro

## 🎯 Funcionalidade Implementada

O **Calendário de Estudos** é uma nova funcionalidade que permite visualizar sua frequência de estudos ao longo do ano, similar ao GitHub Contributions. Ele mostra de forma visual e intuitiva quando e com que intensidade você estudou.

## ✨ Características Principais

### 1. **Visualização em Calendário**

- **Layout anual**: Mostra todos os dias do ano em formato de grade
- **Cores por intensidade**: 5 níveis de cores baseados na quantidade de estudo
- **Dias da semana**: Organização clara por domingo a sábado
- **Meses**: Legendas dos meses para fácil navegação

### 2. **Sistema de Cores**

- 🔘 **Cinza claro**: Nenhum estudo no dia
- 🔵 **Azul claro**: Pouco estudo (1 quiz ou poucas questões)
- 🔵 **Azul médio**: Estudo moderado (2-3 quizzes)
- 🔵 **Azul escuro**: Muito estudo (4-5 quizzes)
- 🔵 **Azul intenso**: Estudo intenso (6+ quizzes ou muitas questões)

### 3. **Estatísticas Rápidas**

- **Dias ativos**: Total de dias em que você estudou
- **Total quizzes**: Número total de quizzes realizados
- **Sequência máxima**: Maior sequência consecutiva de dias estudando
- **Sequência atual**: Sequência atual de dias estudando

### 4. **Interatividade**

- **Tooltips**: Passe o mouse sobre os dias para ver detalhes
- **Hover effects**: Animações ao passar o mouse
- **Responsivo**: Funciona em dispositivos móveis e desktop

## 🚀 Como Acessar

1. **Acesse o Dashboard** principal do EstudaPro
2. **Clique na aba "Calendário"** (nova aba azul ciano)
3. **Visualize seu histórico** de estudos do ano atual

## 📊 Como Interpretar

### **Padrões de Estudo**

- **Dias vazios**: Dias sem atividade de estudo
- **Manchas azuis**: Dias com atividade de estudo
- **Intensidade das cores**: Quanto mais escuro, mais intenso foi o estudo

### **Sequências**

- **Sequência atual**: Quantos dias seguidos você está estudando
- **Sequência máxima**: Seu recorde pessoal de dias consecutivos
- **Consistência**: Padrão regular de estudo é melhor que estudo esporádico

### **Insights**

- **Frequência**: Quantos dias por semana você estuda
- **Intensidade**: Se você prefere estudar muito em poucos dias ou pouco todos os dias
- **Progresso**: Como sua rotina de estudo evolui ao longo do ano

## 🎨 Personalização

O calendário se adapta automaticamente aos seus dados:

- **Cores**: Baseadas na quantidade de quizzes e questões por dia
- **Intensidade**: Calculada considerando tanto volume quanto frequência
- **Período**: Sempre mostra o ano atual completo

## 📱 Responsividade

- **Desktop**: Visualização completa com todas as funcionalidades
- **Tablet**: Layout adaptado para telas médias
- **Mobile**: Scroll horizontal para navegar pelo calendário

## 🔧 Tecnologia

- **React**: Componente funcional com hooks
- **TypeScript**: Tipagem completa para segurança
- **date-fns**: Manipulação avançada de datas
- **Tailwind CSS**: Estilização responsiva e moderna
- **Lucide React**: Ícones consistentes

## 🚀 Próximas Melhorias

### **Funcionalidades Planejadas**

- [ ] **Filtros por período**: Visualizar meses ou trimestres específicos
- [ ] **Filtros por caderno**: Ver atividade por matéria específica
- [ ] **Comparação anual**: Comparar anos diferentes
- [ ] **Metas visuais**: Mostrar metas de estudo no calendário
- [ ] **Exportação**: Salvar calendário como imagem

### **Melhorias de UX**

- [ ] **Zoom**: Ampliar períodos específicos
- [ ] **Navegação**: Botões para navegar entre anos
- [ ] **Animações**: Transições suaves entre períodos
- [ ] **Temas**: Cores personalizáveis

## 💡 Dicas de Uso

### **Para Estudantes**

1. **Mantenha consistência**: Tente estudar pelo menos um pouco todos os dias
2. **Observe padrões**: Identifique seus melhores horários e dias
3. **Estabeleça metas**: Use as sequências para criar desafios pessoais
4. **Analise progresso**: Veja como sua rotina evolui ao longo do tempo

### **Para Professores/Coaches**

1. **Acompanhe alunos**: Use para monitorar frequência de estudo
2. **Identifique padrões**: Veja quando os alunos mais estudam
3. **Ajuste estratégias**: Adapte recomendações baseado no histórico
4. **Motivação**: Use as sequências para incentivar consistência

## 🐛 Solução de Problemas

### **Calendário não carrega**

- Verifique se há dados de quiz no sistema
- Recarregue a página
- Verifique a conexão com o banco de dados

### **Cores não aparecem**

- Verifique se há quizzes com datas válidas
- Confirme se as datas estão no formato correto
- Verifique se o componente está recebendo os dados

### **Layout quebrado**

- Verifique se está usando uma versão recente do navegador
- Tente redimensionar a janela
- Verifique se o CSS está carregando corretamente

## 📝 Exemplo de Uso

```typescript
// O componente é usado automaticamente no Dashboard
<StudyCalendar quizHistory={quizHistory} cadernos={cadernos} />;

// Dados esperados
interface QuizHistory {
  completed_at: string; // Data de conclusão
  total_questions: number; // Total de questões
  correct_answers: number; // Respostas corretas
  quiz?: {
    title?: string; // Título do quiz
    caderno_id?: string; // ID do caderno/matéria
  };
}
```

## 🎉 Conclusão

O **Calendário de Estudos** transforma dados brutos de estudo em uma visualização intuitiva e motivadora. Ele ajuda você a:

- **Visualizar** sua rotina de estudos
- **Identificar** padrões e tendências
- **Manter** consistência e motivação
- **Acompanhar** seu progresso ao longo do tempo

Esta funcionalidade representa um passo importante na transformação do EstudaPro em uma plataforma completa de gestão de estudos, oferecendo insights visuais que ajudam na tomada de decisões sobre sua rotina de preparação para concursos.

