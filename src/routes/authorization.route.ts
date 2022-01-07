import { Router, Request, Response,  NextFunction} from 'express';
import ForbiddenError from '../models/errors/forbidden.error.model';
import userRepository from '../repositories/user.repository';
import JWT from 'jsonwebtoken';


const authorizationRoute = Router();

authorizationRoute.post('/token', async (req:Request, res:Response, next:NextFunction) => {
    try {
        /* pegando o conteúdo do header authorization */
        const authorizationHeader = req.headers['authorization'];

        if(!authorizationHeader){
            throw new ForbiddenError('Credenciais não informadas');
        }

        //basic myWSCxSk12PxI
        const [autheticationType, token] = authorizationHeader.split(' ');

        if(autheticationType !== 'Basic' || !token){
            throw new ForbiddenError('Tipo de autenticação inválido');
        }

        //criamos um buffet de nosso token
        const tokenContent = Buffer.from(token, 'base64').toString('utf-8');

        //aqui fazemos um split para quebrar o conteúdo deixar cada parte uma variavel username e senha
        const [username, password] = tokenContent.split(':');

        //retornará um erro forbidden caso usuario ou senha não estiver preenchido
        if(!username || !password){
            throw new ForbiddenError('Credênciadas não preenchidas');
        }

        const user  = await userRepository.findUsernameAndPassword(username, password);
        
        console.log(user);

        // "iss" O domínio da aplicação geradora do token
        // "sub" É o assunto do token, mas é muito utilizado para guarda o ID do usuário
        // "aud" Define quem pode usar o token
        // "exp" Data para expiração do token
        // "nbf" Define uma data para qual o token não pode ser aceito antes dela
        // "iat" Data de criação do token
        // "jti" O id do token

    } catch (error) {
        next(error);
    }


    
});


export default authorizationRoute;