const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');

const events = eventIds => {
    return Event
    .find({_id: {$in: eventIds}})
    .then(events => {
        return events.map(event => {
            return {
                ...event._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        })
    })
    .catch(err => {
        throw err;
    });
};

const user = userId => {
    return User
    .findById(userId)
    .then(user => {
        return {
            ...user._doc,
            createdEvent: events.bind(this, user._doc.createdEvent)
        };
    })
    .catch(err => {
        throw err;
    });
};

module.exports = {
    events: () => {
        return Event
        .find()
        .then(events => {
            return events.map(event => {
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            });
        })
        .catch(err => {
            throw err;
        });
    },
    createEvent: ({eventInput}) => {
        const event = new Event({
            title: eventInput.title,
            description: eventInput.description,
            date: new Date(eventInput.date),
            time: eventInput.time,
            creator: '601f2ff3de321b057630cc27'
        });
        let createdEvent;
        return event
        .save()
        .then(result => {
            createdEvent = {
                ...result._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            };
            return User.findById('601f2ff3de321b057630cc27');
        })
        .then(user => {
            if (!user) {
                throw new Error('User not found.');
            }
            user.createdEvent.push(event);
            return user.save();
        })
        .then(result => {
            return createdEvent;
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
    },
    createUser: ({userInput}) => {
        return User
        .findOne({email: userInput.email})
        .then(user => {
            if (user) {
                throw new Error('User email exists already.');
            }
            return bcrypt
            .hash(userInput.password, 12)
        })
        .then(hashedPassword => {
            const user = new User({
                email: userInput.email,
                password: hashedPassword,
                username: userInput.username
            });
            return user.save();
        })
        .then(result => {
            return {...result._doc, password: "You can't retrieve the password"};
        })
        .catch(err => {
            throw err;
        });
    }
};