const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Master = require('../models/masterModel')
const Organization = Master.OrganizationModal;
const DashboardModal = require('../models/dashboardModel')
const Dashboard = DashboardModal.Dashboard
const moment = require('moment');
const { sendMail } = require('../middleware/sendMail')
const MasterSource = Master.SourceModal;
const MasterState = Master.StateModal;
const MasterCountry = Master.CountryModal;
const MasterCity = Master.CityModal;
const MasterUnit = Master.UnitModal;
const MasterIcon = Master.IconModal;
const MasterModule = Master.ModuleModal;
const MasterRole = Master.RoleModal;
const MasterStatus = Master.StatusModal;
const MasterType = Master.TypeModal;
const SaasModal = require('../models/saasmasterModel');
const Source = SaasModal.SourceModal;
const State = SaasModal.StateModal;
const Country = SaasModal.CountryModal;
const City = SaasModal.CityModal;
const Unit = SaasModal.UnitModal;
const Icon = SaasModal.IconModal;
const Module = SaasModal.ModuleModal;
const Role = SaasModal.RoleModal;
const Status = SaasModal.StatusModal;
const Type = SaasModal.TypeModal;
const saasModuleRights = SaasModal.ModuleRightModal;
const ApplicationSetting = SaasModal.ApplicationSettingModal;
const ModuleRight = require('../models/moduleRightModel')

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body

    if (!name || !email || !password || !role) {
        res.status(400)
        throw new Error('Name, Email, Password and Role  fields are required!')
    }
    let Users = User(req.conn)
    let Dashboards = Dashboard(req.conn)
    //check if user exist
    const userExists = await Users.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User Already Exists!')
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user
    const user = await Users.create({
        name,
        email,
        role,
        password: hashedPassword,
        is_active: true

    })
    await Dashboards.create({
        Lead: 0,
        Prospect: 0,
        Support: 0,
        Recovery: 0,
        Product: 0,
        Customer: 0,
        Project: 0,
        Order: 0,
        UserId: user.id
    });
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid user data!")
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const { name, id, role } = req.body

    if (!name || !role) {
        res.status(400)
        throw new Error('Name and Role  fields are required!')
    }
    if (!id) {
        res.status(400)
        throw new Error('User id not found!')
    }
    let Users = User(req.conn)
    //check if user exist
    const userExists = await Users.findOne({ _id: id });
    if (!userExists) {
        res.status(400)
        throw new Error('User Not Found')
    }

    let user = await Users.findByIdAndUpdate(id, {
        name: name,
        role: role,
    });
    user = await Users.findOne({ _id: id });
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid user data!")
    }
})
const removeUser = asyncHandler(async (req, res) => {
    let Users = User(req.conn)
    try {
        const existUser = await Users.findById(req.body.id);
        if (!existUser) {
            return res.status(200).json({
                success: false,
                msg: "User not found.",
                data: null,
            });
        }

        const newUser = await Users.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        return res.status(200).json({
            success: true,
            msg: "User removed. ",
            data: null
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing User. " + err.message,
            data: null,
        });
    }

});
const changePassword = asyncHandler(async (req, res) => {
    const { id, currentPassword, newPassword } = req.body

    if (!id || !currentPassword || !newPassword) {
        res.status(400)
        throw new Error('id, current password and new password field not found!')
    }

    let Users = User(req.conn)
    //check if user exist
    const userExists = await Users.findOne({ _id: id });
    if (!userExists) {
        res.status(400)
        throw new Error('User Not Found')
    }
    let user = await Users.findOne({ _id: id });
    if (user) {
        if ((await bcrypt.compare(currentPassword, user.password))) {
            //Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            await Users.findByIdAndUpdate(id, {
                password: hashedPassword
            });
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            })
        }
        else {
            res.status(400)
            throw new Error("Wrong Current Password!")
        }
    }
    else {
        res.status(400)
        throw new Error("Invalid user data!")
    }
})

const loginUser = asyncHandler(async (req, res) => {
    let Roles = Role(req.conn);
    const { email, password } = req.body
    let Users = User(req.conn)

    const user = await Users.findOne({ email: email, is_active: true }).populate('role');
    if (!user) {
        res.status(200)
        throw new Error("User Not Found!")
    }

    if ((await bcrypt.compare(password, user.password))) {
        let jsonresult = {
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role?.id,
            rolename: user.role?.Name,
            token: generateToken(user.id),
        };
        res.json(jsonresult).end();
    }
    else {
        res.status(401).send({ message: "Invalid credentials!" })
    }
})

const getUserById = asyncHandler(async (req, res) => {
    let Users = User(req.conn)
    const { _id, name, email, role } = await Users.findById(req.params.id)

    res.status(200).json({
        id: _id,
        name,
        email,
        role
    })
})

const getAllUser = asyncHandler(async (req, res) => {
    let Users = User(req.conn)
    let Roles = Role(req.conn)
    try {
        const user = await Users.find({ is_active: req.body.active }, { _id: 1, email: 1, name: 1, role: 1, is_active: 1 }).populate("role").sort({ createdAt: -1 });

        res.status(200).json(user).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting USER. " + err.message,
            data: null,
        });
    }
})
function generateRandomPassword() {
    const length = 6;
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }

    return password;
}
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
        res.status(400)
        throw new Error('email field not found!')
    }
    let Users = User(req.conn)
    //check if user exist
    const userExists = await Users.findOne({ email: email });
    if (!userExists) {
        res.status(400)
        throw new Error('User Not Found')
    }

    if (userExists) {
        //Hash password
        const newPassword = generateRandomPassword();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        let user = await Users.findByIdAndUpdate(userExists._id, {
            password: hashedPassword
        });
        if (user) {
            let html =
                `<html>Dear User,<br/><br/>Good news! Your password has been reset. Here is your new password:<br/><br/><b>New Password:</b> ${newPassword}<br/><br/>Please use this password to log in to your account. If you have any questions or concerns, feel free to reach out to our support team.<br/><br/>Best regards,<br/><b>Team Emoiss</b></html>`;
            sendMail(userExists.email, "Your New Password", html);
        }
        return res.status(201).json({
            success: true,
            msg: "Reset Password is sent to you in email"
        });
    }
    else {
        res.status(400)
        throw new Error("Invalid user data!")
    }
})
const addOrganizationUser = asyncHandler(async (req, res) => {
    let Users = User(req.conn);
    let Sources = Source(req.conn);
    let States = State(req.conn);
    let Countrys = Country(req.conn);
    let Citys = City(req.conn);
    let Units = Unit(req.conn);
    let Icons = Icon(req.conn);
    let Modules = Module(req.conn);
    let Roles = Role(req.conn);
    let Statuss = Status(req.conn);
    let Types = Type(req.conn);
    let LatestModuleRights = saasModuleRights(req.conn);
    let ApplicationSettings = ApplicationSetting(req.conn);
    let Dashboards = Dashboard(req.conn);
    try {
        let oldUser = await Organization.findOne({ Name: req.body.Name });

        if (oldUser) {
            return res.status(400).json({
                success: false,
                message: "Same Organization already exist.",
            });
        }
        const organization = await Organization.create({
            Name: req.body.Name,
            Description: req.body.Description,
            Email: req.body.Email,
            Website: req.body.Website,
            UserEmail: req.body.UserEmail,
            Code: req.body.Code,
            PhoneNo: req.body.PhoneNo,
        });

        const applicationSetting = await ApplicationSettings
            .create({
                CompanyTitle: req.body.Name
            });

        let oldSource = await MasterSource.find({});
        let insertdataSource = oldSource.map(f => ({
            Name: f.Name,
            is_active: f.is_active,
        }))
        await Sources.insertMany(insertdataSource);
        let oldCountry = await MasterCountry.find({});
        let insertdataCountry = oldCountry.map(f => ({
            Name: f.Name,
            is_active: f.is_active,
        }))
        let newCountry = await Countrys.insertMany(insertdataCountry);
        let oldState = await MasterState.find({});
        let insertdataState = [];
        newCountry.forEach(nc => {
            let correspondingOldCountry = oldCountry.find(oc => oc.Name === nc.Name);
            if (correspondingOldCountry) {
                let filteredStates = oldState.filter(state => state.Country.equals(correspondingOldCountry._id));
                filteredStates.forEach(f => {
                    insertdataState.push({
                        Name: f.Name,
                        Country: nc._id,
                        is_active: f.is_active,
                    });
                });
            }
        });
        let newState = await States.insertMany(insertdataState);
        let oldCity = await MasterCity.find({});
        let insertdataCity = [];
        newState.forEach(ns => {
            let correspondingOldState = oldState.find(os => os.Name === ns.Name);
            if (correspondingOldState) {
                let filteredcitys = oldCity.filter(city => city.State.equals(correspondingOldState._id));
                filteredcitys.forEach(f => {
                    insertdataCity.push({
                        Name: f.Name,
                        State: ns._id,
                        is_active: f.is_active,
                    });
                });
            }
        });
        let newCity = await Citys.insertMany(insertdataCity);
        let oldUnit = await MasterUnit.find({});
        let insertdataUnit = oldUnit.map(f => ({
            Name: f.Name,
            is_active: f.is_active,
        }))
        await Units.insertMany(insertdataUnit);
        let oldIcon = await MasterIcon.find({});
        let insertdataIcon = oldIcon.map(f => ({
            Name: f.Name,
            is_active: f.is_active,
        }))
        await Icons.insertMany(insertdataIcon);
        let oldType = await MasterType.find({});
        let insertdataType = oldType.map(f => ({
            Name: f.Name,
            is_active: f.is_active,
        }))
        await Types.insertMany(insertdataType);
        let oldRole = await MasterRole.find({});
        let insertdataRole = oldRole.map(f => ({
            Name: f.Name,
            is_active: f.is_active,
        }))
        let newRole = await Roles.insertMany(insertdataRole);
        let oldStatus = await MasterStatus.find({});
        let insertdataStatus = oldStatus.map(f => ({
            Name: f.Name,
            Role: null,
            Assign: null,
            Assign: null,
            Color: f.Color,
            is_active: f.is_active,
        }))
        await Statuss.insertMany(insertdataStatus);
        let oldModule = await MasterModule.find({});
        let insertdataModule = oldModule.map(f => ({
            Name: f.Name,
            is_group: f.is_group,
            GroupName: f.GroupName,
            is_active: f.is_active,
        }))
        let newModule = await Modules.insertMany(insertdataModule);
        let oldModuleRight = await ModuleRight.find({});
        let insertdataModuleRight = [];
        newRole.forEach(nr => {
            let correspondingOldRole = oldRole.find(or => or.Name === nr.Name);
            if (correspondingOldRole) {
                let filteredRoles = oldModuleRight.filter(moduleright => moduleright.role.equals(correspondingOldRole._id));
                filteredRoles.forEach(f => {
                    let correspondingOldModuleId = oldModule.find(om => om._id.toString() === f.moduleId.toString());
                    if (correspondingOldModuleId) {
                        let filteredModuleRight = newModule.find(nm => nm.Name === correspondingOldModuleId.Name);
                        insertdataModuleRight.push({
                            role: nr._id,
                            moduleId: filteredModuleRight._id,
                            read: f.read,
                            write: f.write,
                            delete: f.delete,
                        });
                    }
                });
            }
        });
        await LatestModuleRights.insertMany(insertdataModuleRight);
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        var roles = await Roles.findOne({ Name: { $regex: "SuperAdmin", $options: 'i' } }, { _id: 1 });
        let newUser = await Users.create({
            name: req.body.firstName,
            role: roles._id,
            email: req.body.UserEmail,
            password: hashedPassword
        });
        await Dashboards.create({
            Lead: 0,
            Prospect: 0,
            Support: 0,
            Recovery: 0,
            Product: 0,
            Customer: 0,
            Project: 0,
            Order: 0,
            UserId: newUser._id
        });
        return res.status(200).json({
            success: true,
            message: "User added successfully",
            data: newUser
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Error in adding User. " + err.message,
        });
    }
});
const checkOrganization = asyncHandler(async (req, res) => {
    try {
        let OrganizationExists = await Organization.findOne({ Code: req.body.code });
        if (OrganizationExists) {
            res.status(200).json({
                success: true,
                _id: OrganizationExists.id,
                DB_NAME: OrganizationExists.Name,
            }).end();
        }
        else {
            res.status(400).json({
                success: false,
                msg: "Invalid Organization Code!",
                data: "",
            }).end();
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Error in Organization. " + err.message,
        });
    }
});
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    updateUser,
    changePassword,
    getAllUser,
    forgotPassword,
    removeUser,
    addOrganizationUser,
    checkOrganization
}