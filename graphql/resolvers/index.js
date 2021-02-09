const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');

const events = async eventIds => {
    try {
       const events = await Event.find({_id: {$in: eventIds}})
       return events.map(event => {
           return {
               ...event._doc,
               date: new Date(event._doc.date).toISOString(),
               creator: user.bind(this, event.creator)
           }
       }) 
    } catch(err) {
        throw err;
    };
};

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            createdEvent: events.bind(this, user._doc.createdEvent)
        };   
    } catch(err) {
        throw err;
    }
};

module.exports = {
    events: async () => {
        try {
         const events = await Event.find()
        
            return events.map(event => {
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            });   
        } catch(err) {
            throw err;
        }
    },
    createEvent: async ({eventInput}) => {
        const event = new Event({
            title: eventInput.title,
            description: eventInput.description,
            date: new Date(eventInput.date),
            time: eventInput.time,
            creator: '601f2ff3de321b057630cc27'
        });
        let createdEvent;
        try {
           const result = await event.save()
            createdEvent = {
                ...result._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            };
            const creator = await User.findById('601f2ff3de321b057630cc27');
            if (!creator) {
                throw new Error('User not found.');
            }
            creator.createdEvent.push(event);
            await creator.save();
            return createdEvent; 
        } catch(err) {
            console.log(err);
            throw err;
        };
    },
    createUser: async ({userInput}) => {
        try {
            const existingUser = await User.findOne({email: userInput.email})
            if (existingUser) {
                throw new Error('User email exists already.');
            }
            const hashedPassword = await bcrypt.hash(userInput.password, 12)
            const user = new User({
                email: userInput.email,
                password: hashedPassword,
                username: userInput.username
            });
            const result = await user.save();
            return {...result._doc, password: "You can't retrieve the password"};
        } catch(err) {
            throw err;
        }
    }
};