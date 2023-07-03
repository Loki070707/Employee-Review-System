const Employee = require('../models/employee');
const Reviews = require('../models/review');

module.exports.profile = async function (req, res) {
    const emp = await Employee.findById(req.params.id);
    const all_emp = await Employee.find({});
    if (emp) {
        res.render('employeeProfile', {
            employee: emp,
            all_emp: all_emp
        });
    }
};

module.exports.loginView = async function (req, res) {
    res.render('employeeLogin');
};

module.exports.createSession = async function (req, res) {
    const user = await Employee.findOne({ email: req.body.email, password: req.body.password });
    if (user) {
        console.log('signed in');
        req.flash('success', "You are Logged In successfully");
        res.redirect(`/employee/dashboard/${user._id}`);
    } else {
        console.log('employee does not exist');
        req.flash('error', "Your account does not exist");
        res.redirect('back');
    }
};

module.exports.dashboard = async function (req, res) {
    res.render('employee', {
        id: req.params.id
    });
};

module.exports.feedback = async function (req, res) {
    console.log(req.params.fId, req.params.tId);

    const review = await Reviews.create({
        feedback: req.body.content,
        reviewBy: req.params.fId,
        reviewFor: req.params.tId
    });

    let emp = await Employee.findByIdAndUpdate(req.params.fId, { $pull: { toReview: req.params.tId } });
    let givenEmp = await Employee.findById(req.params.tId);

    givenEmp.feedbacks.push(review);
    await givenEmp.save();
    console.log(emp);
    console.log(review);
    res.redirect('back');
};

module.exports.taskList = async function (req, res) {
    const emp = await Employee.findById(req.params.id).populate('toReview');
    res.render('employeeTask', {
        employee: emp
    });
};

module.exports.viewFeedback = async function (req, res) {
    const emp = await Employee.findById(req.params.id).populate('feedbacks');
    res.render('employeeFeedback', {
        employee: emp
    });
};
