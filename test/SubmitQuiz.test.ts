import QuizCommunicatorHandler from "../src/application/handler/QuizCommunicatorHandler"
import QuizCorrectorHandler from "../src/application/handler/QuizCorrectorHandler"
import SubmitQuiz from "../src/application/usecase/SubmitQuiz"
import Mediator from "../src/infra/mediator/Mediator"
import QuizRepositoryMemory from "../src/infra/repository/QuizRepositoryMemory"
import MailerMemory from "../src/infra/service/MailerMemory"

test("Um usuário deve submeter um quiz respondido e a nota deve ser calculada e uma notificação por e-mail", async () => {
   const mediator = new Mediator()
   const quizRepository = new QuizRepositoryMemory()
   const quizCorrectorHandler = new QuizCorrectorHandler(quizRepository, mediator)
   mediator.register(quizCorrectorHandler)

   const mailer = new MailerMemory()
   const quizCommunicatorHandler = new QuizCommunicatorHandler(mailer)
   mediator.register(quizCommunicatorHandler)

   const submitQuiz = new SubmitQuiz(mediator)
   const input = {
      name: "João Pedro", 
      email: "joao.pedro@gmail.com",
      idQuiz: 1,
      answers: {
         1: "a",
         2: "b"
      }
   }
   
   await submitQuiz.execute(input)
   expect(mailer.messages[0].message).toBe("Olá João Pedro, sua nota do quiz é 50")
})