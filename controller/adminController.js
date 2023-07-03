const Admin = require('../models/admin.js');
const Employee = require('../models/employee');
const employeeJoiningEmail = require('../mailers/addEmployeeEmail');
const Feedback = require('../models/review');

// This function will render the admin signup ejs file
module.exports.signUp_view = async function (req, res) {
  res.render('sign-up');
};

// This function is to create the admin db
module.exports.createAdmin = async function (req, res) {
  console.log(req.body);
  // Checks to confirm the details given by admin
  if (req.body.password != req.body.confirm_password) {
    console.log('hey passwords not match');
    req.flash('error', "Hey !! Your Passwords Do Not Match");
    return res.redirect('back');
  }

  Admin.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log(err);
    }
    if (!user) {
      // It creates the admin
      Admin.create(req.body, function (err, user) {
        if (err) {
          console.log(err);
          return;
        }

        req.flash('success', "Registered Successfully");

        return res.redirect('/admin/login');
      });
    } else {
      console.log("You have signed up, login to continue!");
      req.flash('success', "You are already Registered");
      return res.redirect('back');
    }
  });
};

// It renders the login page view
module.exports.loginPage = function (req, res) {
  res.render('sign-in');
};

// It creates the session for the admin
module.exports.createSession = async function (req, res) {
  // It is manual authentication ⛔⛔here I have to use passport and its session
  const user = await Admin.findOne({ email: req.body.email });

  if (user) {
    console.log('signed in ');
    req.flash('success', "Logged in successfully");
    res.render('admin');
  } else {
    console.log('admin does not exist');
    res.redirect('/admin/sign-up');
  }
};

// From this controller, the admin can also add an employee to the company
module.exports.addEmployee = function (req, res) {
  // This will render the page through which admin can add an employee
  res.render('admin_add_employee');
};

module.exports.addEmployeeToDatabase = async function (req, res) {
  // Through this action, the admin is creating the employee from their end
  const user = await Employee.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.name
  });

  if (user) {
    console.log('Employee created');
    req.flash('success', "Employee Created");
    employeeJoiningEmail.joiningEmail(user);
  }

  res.render('admin');
};

// This controller provides all the employee details to the admin and renders the current employee list
module.exports.viewEmployee = async function (req, res) {
  const employee = await Employee.find({});
  res.render('allEmployee', {
    employee: employee
  });
};

// In this controller, the admin receives all the reviews that the employee has commented on other employees
module.exports.listFeedback = async function (req, res) {
  const reviews = await Feedback.find({}).populate('reviewBy').populate('reviewFor');
  res.render('feedbacks', {
    reviews: reviews
  });
};

// From this action, the admin can update the employee's info
module.exports.updateEmployee = async function (req, res) {
  var emp = await Employee.findById(req.params.id);
  if (!emp) {
    req.flash('error', "Requested employee does not exist");
    return res.redirect('back');
  }
  console.log(req.body);

  // Check if the employee is already an admin
  const is_admin = req.body.isAdmin == "yes" ? true : false;

  // Check if the employee is being removed
  const removeEmployee = req.body.removeEmployee == "yes" ? true : false;

  // When the employee is being made an admin, add their data to the admin db
  if (is_admin) {
    const admin = await Admin.create({
      name: emp.name,
      email: emp.email,
      password: emp.password
    });
  }

  if (removeEmployee) {
    console.log(emp);

    // Delete employee data from employee db
    await Feedback.findOneAndDelete({ reviewBy: req.params.id });
    await Feedback.findOneAndDelete({ reviewFor: req.params.id });
    await Employee.deleteOne({ _id: req.params.id });

    // If the employee was previously made an admin, remove them from the admin db as well
    await Admin.findOneAndDelete({ email: emp.email });

    req.flash('success', "Employee has been removed");
    return res.redirect('/admin/viewEmployee');
  }

  if (emp) {
    // If the employee is not being removed, only their information is being updated
    emp = await Employee.findByIdAndUpdate(req.params.id, {
      $set: {
        designation: req.body.designation,
        contactNo: req.body.phone,
        is_admin: is_admin
      }
    });

    if (emp) {
      await emp.save();
    }

    req.flash('success', "Employee information updated");
    res.redirect('/admin/viewEmployee');
  }
};

// This controller is used to assign an employee to review other employees
module.exports.assign2Employee = async function (req, res) {
  console.log(req.body);
  const arr = req.body.name;

  // Fetch the employee based on the given id in params
  const employee = await Employee.findById(req.params.id);

  if (employee) {
    if (arr.length != undefined) {
      // Assign multiple employees to review
      for (var e of arr) {
        const emp = await Employee.findOne({ email: e });

        employee.toReview.push(emp);
      }

      employee.save();
      req.flash('success', "Task assigned to employee");
      res.redirect('/admin/viewEmployee');
    } else {
      // Assign a single employee to review
      Employee.findOne({ email: req.body.name }, function (err, emp) {
        if (err) {
          console.log(err);
        }

        employee.toReview.push(emp);
        employee.save();
        req.flash('success', "Task assigned to employee");
        res.redirect('/admin/viewEmployee');
      });
    }
  } else {
    res.send("Requested employee does not exist");
  }
};

// Admin should be able to view all the feedback given by employees
module.exports.viewFeedback = async function (req, res) {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    req.flash('error', "Requested employee does not exist");
    return res.redirect('back');
  }

  const feedbacks = await Feedback.find({ reviewFor: employee._id }).populate('reviewBy');

  res.render('employeeFeedback', {
    employee: employee,
    feedbacks: feedbacks
  });
};
