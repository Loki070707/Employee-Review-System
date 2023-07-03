const express=require('express')
const router=express.Router()
const adminController=require('../controller/adminController')

// ------------------------admin authentication actions------------------------ 
router.get('/sign-up',adminController.signUp_view)
router.post('/createAdmin',adminController.createAdmin)
router.get('/login',adminController.loginPage)
router.post('/create-session',adminController.createSession)



// ------------------------admin2Employee actions ------------------------------
router.get('/addEmployee',adminController.addEmployee)
router.post('/addEmployee',adminController.addEmployeeToDatabase)
router.post('/updateEmployee/:id',adminController.updateEmployee)
router.get('/viewEmployee',adminController.viewEmployee)
router.get('/viewListFeedback',adminController.listFeedback)
router.post('/Employee_as_Reviewer/:id',adminController.assign2Employee)



module.exports=router


