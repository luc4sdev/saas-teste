import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from 'react-toastify'
import { EnumCategory } from "@/components/admin/CreateExerciseForm"
import { EnumDifficulty, EnumGoal, EnumWorkoutType } from "@/components/admin/CreateWorkoutForm"
import { Workout } from "@/app/server/get-workouts-data"
import jsPDF from "jspdf"
import { EnumGender } from "@/components/dashboard/CreateCustomerForm"


type ToastMessageProps = {
  message: string
  type: 'error' | 'success' | 'warning' | 'info'
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toastMessage = ({ message, type }: ToastMessageProps) => {
  toast(message, {
    position: 'top-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    type: type,
  })
}

const categoryTranslations: Record<EnumCategory, string> = {
  chest: "Peito",
  arms: "Braços",
  shoulders: "Ombros",
  back: "Costas",
  lower: "Inferiores",
  quadriceps: "Quadríceps",
  glutes: "Glúteos",
  hamstrings: "Posteriores",
  mobility: "Mobilidade",
  correction: "Correção Postural",
  strengthening: "Fortalecimento",
};

export function translateCategory(muscle: EnumCategory): string {
  return categoryTranslations[muscle];
}

const difficultyTranslations: Record<EnumDifficulty, string> = {
  beginner: "Iniciante",
  intermediate1: "Intermediário 1",
  intermediate2: "Intermediário 2",
  advanced: "Avançado",
};

export function translateDifficulty(difficulty: EnumDifficulty): string {
  return difficultyTranslations[difficulty];
}

const workoutTypeTranslations: Record<EnumWorkoutType, string> = {
  male: "Masculino",
  female: "Feminino",
  general: "Geral",
};

export function translateWorkoutType(workoutType: EnumWorkoutType): string {
  return workoutTypeTranslations[workoutType];
}

const goalTranslations: Record<EnumGoal, string> = {
  hypertrophy: "Hipertrofia",
  weightLoss: "Perda de peso",
  mobility: "Mobilidade",
  correction: "Correção Postural",
  strengthening: "Fortalecimento",
};

export function translateGoal(goal: EnumGoal): string {
  return goalTranslations[goal];
}



const genderTranslations: Record<EnumGender, string> = {
  male: "Masculino",
  female: "Feminino",
};

export function translateGender(gender: EnumGender): string {
  return genderTranslations[gender];
}


export function generatePdfWorkout(workout: Workout) {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const logo = '/logo.png'; // Certifique-se de que o caminho da logo está correto
    let yOffset = 20;

    // Adicionar logo
    if (logo) {
      doc.addImage(logo, 'PNG', pageWidth - 40, 10, 30, 30); // Ajuste o tamanho e posição da logo
    }

    // Título do treino
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 53, 147); // Azul escuro
    doc.text(`Treino: ${workout.name}`, pageWidth / 2, yOffset, { align: "center" });
    yOffset += 15;

    // Informações gerais
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0); // Preto
    doc.text(`Tipo: ${translateWorkoutType(workout.workoutType)}`, 20, yOffset);
    yOffset += 8;
    doc.text(`Dificuldade: ${translateDifficulty(workout.difficulty)}`, 20, yOffset);
    yOffset += 8;
    doc.text(`Objetivo: ${translateGoal(workout.goal)}`, 20, yOffset);
    yOffset += 8;
    doc.text(`Frequência Semanal: ${workout.weeklyFrequency} por semana`, 20, yOffset);
    yOffset += 15;

    // Subtreinos e exercícios
    workout.subWorkouts.filter((subWorkout) => subWorkout.exercises.length > 0).forEach((subWorkout, index) => {
      // Calcular a altura total do subtreino
      let subWorkoutHeight = 10; // Título do subtreino
      subWorkoutHeight += 10; // Linha divisória
      subWorkout.exercises.forEach((exercise) => {
        subWorkoutHeight += 8; // Nome do exercício
        if (exercise.category) subWorkoutHeight += 6; // Categoria
        if (exercise.description) {
          const descriptionLines = doc.splitTextToSize(`  Descrição: ${exercise.description}`, pageWidth - 40);
          subWorkoutHeight += 6 * descriptionLines.length; // Descrição
        }
        subWorkoutHeight += 4; // Espaço entre exercícios
      });
      subWorkoutHeight += 10; // Espaço extra entre subtreinos

      // Verificar se o subtreino cabe na página atual
      if (yOffset + subWorkoutHeight > 270) { // Nova página se não couber
        doc.addPage();
        yOffset = 20;
      }

      // Título do subtreino
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 53, 147); // Azul escuro
      doc.text(subWorkout.name, 20, yOffset);
      yOffset += 10;

      // Linha divisória
      doc.setDrawColor(200, 200, 200); // Cinza claro
      doc.line(20, yOffset, pageWidth - 20, yOffset);
      yOffset += 10;

      // Exercícios
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0); // Preto
      subWorkout.exercises.forEach((exercise) => {
        // Nome do exercício
        doc.setFont('helvetica', 'bold');
        doc.text(`- ${exercise.name}: ${exercise.sets} séries x ${exercise.repetitions} repetições`, 25, yOffset);
        yOffset += 8;

        // Categoria
        if (exercise.category) {
          doc.setFont('helvetica', 'normal');
          doc.text(`  Categoria: ${translateCategory(exercise.category)}`, 30, yOffset);
          yOffset += 6;
        }
        doc.setFont('helvetica', 'normal');
        doc.text(`Tempo de descanso: ${exercise.restTime}s`, 30, yOffset);
        yOffset += 6;
        // Descrição (com quebra de linha)
        if (exercise.description) {
          const descriptionLines = doc.splitTextToSize(`  Descrição: ${exercise.description}`, pageWidth - 40); // Largura máxima
          doc.text(descriptionLines, 30, yOffset);
          yOffset += 6 * descriptionLines.length; // Ajusta o espaçamento com base no número de linhas
        }

        // Espaço entre exercícios
        yOffset += 4;
      });

      // Espaço extra entre subtreinos
      yOffset += 10;
    });

    // Rodapé
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100); // Cinza
    doc.text(`Gerado em ${new Date().toLocaleDateString()}`, pageWidth / 2, 280, { align: "center" });

    // Salvar o PDF
    doc.save(`${workout.name}_treino.pdf`);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return null;
  }
}

export const htmlEmail = `
                              <!DOCTYPE html>
                              <html>
                              <head>
                                  <style>
                                      body {
                                          font-family: Arial, sans-serif;
                                          line-height: 1.6;
                                          color: #000;
                                          max-width: 600px;
                                          margin: 0 auto;
                                          padding: 20px;
                                      }
                                      .header {
                                          text-align: center;
                                          padding: 20px 0;
                                      }
                                      .logo {
                                          max-width: 150px;
                                      }
                                      .content {
                                          background-color: #f9f9f9;
                                          padding: 20px;
                                          border-radius: 8px;
                                          margin: 20px 0;
                                      }
                                      .button {
                                          display: inline-block;
                                          padding: 12px 24px;
                                          background-color: #4B2DBB;
                                          color: #FFFFFF !important; 
                                          text-decoration: none;
                                          border-radius: 4px;
                                          font-weight: bold;
                                          margin: 10px 0;
                                      }
                                      .footer {
                                          text-align: center;
                                          font-size: 12px;
                                          color: #777;
                                          margin-top: 20px;
                                      }
                                  </style>
                              </head>
                              <body>
                                  <div class="header">
                                      <img src="https://gfitapp.com/logo.png" alt="ClickFlow Logo" class="logo">
                                      <h1>Assinatura Confirmada!</h1>
                                  </div>
                                  
                                  <div class="content">
                                      <p>Olá,</p>
                                      <p>Sua assinatura do ClickFlow foi confirmada com sucesso! 🎉</p>
                                      <p>Agora você tem acesso completo a todos os recursos premium do nosso aplicativo.</p>
                                      
                                      <p><strong>Detalhes da assinatura:</strong></p>
                                      <ul>
                                          <li>Status: Ativa</li>
                                          <li>Data de confirmação: ${new Date().toLocaleDateString()}</li>
                                      </ul>
                                      
                                      <p>Acesse os seus treinos:</p>
                                      <p>
                                          <a href="gfitapp.com" class="button">Acessar dashboard</a>
                                      </p>
                                      
                                      <p>Se tiver qualquer dúvida, não hesite em nos contatar.</p>
                                      <p>Para gerenciar sua assinatura acesse a página de configurações.</p>
                                      <p>Atenciosamente,<br>Equipe ClickFlow</p>
                                  </div>
                                  
                                  <div class="footer">
                                      <p>© ${new Date().getFullYear()} ClickFlow. Todos os direitos reservados.</p>
                                      <p>Se você não reconhece esta ação, por favor entre em contato conosco.</p>
                                  </div>
                              </body>
                              </html>
                              `