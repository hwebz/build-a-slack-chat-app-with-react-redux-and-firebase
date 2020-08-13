import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header, Icon, Form, Segment, Button, Message} from 'semantic-ui-react';
import firebase from '../../firebase';
import DisplayIf from '../Common/DisplayIf';
import ErrorList from '../Common/ErrorList';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const handleChange = e => {
        const {name, value} = e.target;
        switch(name) {
            case "username":
                setUsername(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "passwordConfirmation":
                setPasswordConfirmation(value);
                break;
            default:
        }
    }

    const isFormEmpty = () => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    const isPasswordValid = () => {
        return password.length > 6
            && passwordConfirmation.length > 6
            && password === passwordConfirmation;
    }

    const isFormValid = () => {
        let errors = [];

        if (isFormEmpty()) {
            errors.push({ message: 'Fill in all fields' });
        } else if (!isPasswordValid()) {
            errors.push({ message: 'Password is invalid' });
        }

        setErrors(errors);
        return !errors.length;
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (isFormValid()) {
            setErrors([]);
            setLoading(true);

            // Enable sign-in methods in Authentication tab of Firebase
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(createdUser => {
                    console.log(createdUser);
                    setLoading(false);
                })
                .catch(error => {
                    console.log(error);
                    setLoading(false);
                    setErrors([error]);
                })
        }
    }

    const handleInputError = name => {
        return errors.some(error => error.message.toLowerCase().includes(name)) ? 'error' : '';
    }

    return (
        <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as="h2" icon color="orange" textAlign="center">
                    <Icon name="puzzle piece" color="orange" />
                    Register for DevChat
                </Header>
                <Form size="large" onSubmit={handleSubmit}>
                    <Segment>
                        <Form.Input
                            fluid
                            name="username"
                            icon="user"
                            iconPosition="left"
                            placeholder="Username"
                            onChange={handleChange}
                            className={handleInputError('username') ? 'error' : ''}
                            type="text"
                            value={username}
                        />
                        <Form.Input
                            fluid
                            name="email"
                            icon="mail"
                            iconPosition="left"
                            placeholder="Email"
                            onChange={handleChange}
                            className={handleInputError('email') ? 'error' : ''}
                            type="email"
                            value={email}
                        />
                        <Form.Input
                            fluid
                            name="password"
                            icon="lock"
                            iconPosition="left"
                            placeholder="Password"
                            onChange={handleChange}
                            className={handleInputError('password') ? 'error' : ''}
                            type="password"
                            value={password}
                        />
                        <Form.Input
                            fluid
                            name="passwordConfirmation"
                            icon="refresh"
                            iconPosition="left"
                            placeholder="Password Confirmation"
                            onChange={handleChange}
                            className={handleInputError('password') ? 'error' : ''}
                            type="password"
                            value={passwordConfirmation}
                        />
                        <Button
                            color="orange"
                            fluid
                            size="large"
                            className={loading ? 'loading' : ''}
                            disabled={loading}
                        >Submit</Button>
                    </Segment>
                </Form>
                <DisplayIf condition={errors.length}>
                    <Message error>
                        <h3>Error</h3>
                        <ErrorList errors={errors} />
                    </Message>
                </DisplayIf>
                <Message>Already a user? <Link to="/login">Login</Link></Message>
            </Grid.Column>
        </Grid>
    )
};

export default Register;