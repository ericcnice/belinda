-- Criar tabela de tarefas
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  icon TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);
CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON tasks(user_id, date);

-- Habilitar RLS (Row Level Security)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Política para usuários autenticados verem apenas suas próprias tarefas
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid()::text = user_id);

-- Política para usuários autenticados criarem suas próprias tarefas
CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Política para usuários autenticados atualizarem suas próprias tarefas
CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid()::text = user_id);
