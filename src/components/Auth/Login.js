import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header, Icon, Form, Segment, Button, Message} from 'semantic-ui-react';
import firebase from '../../firebase';
import DisplayIf from '../Common/DisplayIf';
import ErrorList from '../Common/ErrorList';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const usersRef = firebase.database().ref('users');
    
    const handleChange = e => {
        const {name, value} = e.target;
        switch(name) {
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            default:
        }
    }

    const isFormEmpty = () => {
        return !email.length || !password.length;
    }

    const isPasswordValid = () => {
        return password.length > 6
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
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(signedInUser => {
                    console.log(signedInUser);
                    setLoading(false);
                }).catch(error => {
                    console.log(error);
                    setErrors([error]);
                    setLoading(false);
                });
        }
    }

    const handleInputError = name => {
        return errors.some(error => error.message.toLowerCase().includes(name)) ? 'error' : '';
    }

    return (
        <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as="h1" icon color="orange" textAlign="center">
                    <Icon name="code branch" color="violet" />
                    Login to DevChat
                </Header>
                <Form size="large" onSubmit={handleSubmit}>
                    <Segment>
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
                <Message>Don't have an account? <Link to="/register">Register</Link></Message>
            </Grid.Column>
        </Grid>
    )
};

export default Login;