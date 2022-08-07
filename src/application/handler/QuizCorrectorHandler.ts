import DomainEvent from "../../domain/event/DomainEvent";
import QuizCorrected from "../../domain/event/QuizCorrected";
import QuizSubmitted from "../../domain/event/QuizSubmitted";
import QuizRepository from "../../domain/repository/QuizRepository";
import Mediator from "../../infra/mediator/Mediator";
import Handler from "./Handler";

export default class QuizCorrectorHandler implements Handler {
   eventName = "QuizSubmitted"

   constructor(readonly quizRepository: QuizRepository, readonly mediator: Mediator){}

  async handle(event: QuizSubmitted): Promise<void>{
      const quiz = await this.quizRepository.get(event.idQuiz)
      let correctAnswer = 0 
      for(const question of quiz.questions){
         console.log(question);
         
         if(event.answers[question.id] === question.correctAnswer){
            correctAnswer++
         }
      }
      const grade = (correctAnswer/quiz.questions.length)*100
      const quizCorrected = new QuizCorrected(event.userName, event.email, grade)
      this.mediator.publish(quizCorrected)
   }

}