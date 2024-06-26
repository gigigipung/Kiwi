package com.kh.kiwi.config.log;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

@Aspect
@Component
public class KiwiLog {
    private Logger logger = LoggerFactory.getLogger(KiwiLog.class);

//    @Pointcut("execution(public * com.kh.kiwi..*Dao.*(..))")
//    public void daoPointcut() {}

//    @Pointcut("execution(public * com.kh.kiwi..*Service.*(..))")
//    public void servicePointcut() {}

    @Pointcut("execution(public * com.kh.kiwi..*Controller.*(..))")
    public void controllerPointcut() {}
    @Pointcut("execution(public * com.kh.kiwi..*Filter.*(..))")
    public void filterPointcut() {}

//    @Around("daoPointcut()")
//    public Object aroundDaoLog(ProceedingJoinPoint pjp) throws Throwable {
//        Object returnObj = null;
//        // pjp.getThis() : 클래스명
//        // pjp.getSignature().getName(): 타겟메소드명
//        logger.debug("▷▷▷["+pjp.getThis()+":"+pjp.getSignature().getName()+"]");
//        // pjp.getArgs() : 메소드의 파라메터 값들이 들어있음.
//        Object[] args = pjp.getArgs();
//        for(int i=0; i<args.length; i++) {
//            logger.debug("▷▷▷-args["+i+"] "+args[i]+"");
//        }
//        StopWatch stopwatch = new StopWatch();
//        stopwatch.start();
//        // pjp.proceed() : 타겟메소드 호출함
//        returnObj = pjp.proceed();
//        stopwatch.stop();
//        logger.debug("▷▷▷[Dao ▷ "+stopwatch.getTotalTimeMillis()+"ms]"+returnObj);
//        return returnObj;
//    }

//    @Around("servicePointcut()")
//    public Object aroundDaoLog(ProceedingJoinPoint pjp) throws Throwable {
//        Object returnObj = null;
//        // pjp.getThis() : 클래스명
//        // pjp.getSignature().getName(): 타겟메소드명
//        logger.debug("▷▷▷["+pjp.getThis()+":"+pjp.getSignature().getName()+"]");
//        // pjp.getArgs() : 메소드의 파라메터 값들이 들어있음.
//        Object[] args = pjp.getArgs();
//        for(int i=0; i<args.length; i++) {
//            logger.debug("▷▷▷-args["+i+"] "+args[i]+"");
//        }
//        StopWatch stopwatch = new StopWatch();
//        stopwatch.start();
//        // pjp.proceed() : 타겟메소드 호출함
//        returnObj = pjp.proceed();
//        stopwatch.stop();
//        logger.debug("▷▷▷[Dao ▷ "+stopwatch.getTotalTimeMillis()+"ms]"+returnObj);
//        return returnObj;
//    }


    @Around("controllerPointcut()")
    public Object aroundControllerLog(ProceedingJoinPoint pjp) throws Throwable {
        Object returnObj = null;
        // pjp.getThis() : 클래스명
        // pjp.getSignature().getName(): 타겟메소드명
        logger.debug("### ["+pjp.getThis()+":"+pjp.getSignature().getName()+"]");
        // pjp.getArgs() : 메소드의 파라메터 값들이 들어있음.
        Object[] args = pjp.getArgs();
        for(int i=0; i<args.length; i++) {
            logger.debug("### - args["+i+"] "+args[i]+"");
        }
        StopWatch stopwatch = new StopWatch();
        stopwatch.start();
        // pjp.proceed() : 타겟메소드 호출함
        returnObj = pjp.proceed();
        stopwatch.stop();
        logger.debug("### [Ctrl ◁ "+stopwatch.getTotalTimeMillis()+"ms]"+returnObj);
        return returnObj;
    }

    @Around("filterPointcut()")
    public Object aroundFilterLog(ProceedingJoinPoint pjp) throws Throwable {
        Object returnObj = null;
        // pjp.getThis() : 클래스명
        // pjp.getSignature().getName(): 타겟메소드명
        logger.debug("### ["+pjp.getThis()+":"+pjp.getSignature().getName()+"]");
        // pjp.getArgs() : 메소드의 파라메터 값들이 들어있음.
        Object[] args = pjp.getArgs();
        for(int i=0; i<args.length; i++) {
            logger.debug("### - args["+i+"] "+args[i]+"");
        }
        StopWatch stopwatch = new StopWatch();
        stopwatch.start();
        // pjp.proceed() : 타겟메소드 호출함
        returnObj = pjp.proceed();
        stopwatch.stop();
        logger.debug("### [filter ◁ "+stopwatch.getTotalTimeMillis()+"ms]"+returnObj);
        return returnObj;
    }
}