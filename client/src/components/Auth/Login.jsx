import styled from "styled-components";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "../../context/AuthProvider";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #5c65ed;
  display: flex;
`;

const LeftContainer = styled.div`
  display: flex;
  flex: 1;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex: 1;
  background-color: black;
  @media (max-width: 1023px) {
    display: none;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 70%;
  height: 85%;
  @media (max-width: 425px) {
    width: 100%;
  }
  @media (max-width: 1080px) {
    width: 85%;
  }
`;

const LeftLogo = styled.div`
  display: flex;
  width: 70%;
  justify-content: start;
`;

const LogoImg = styled.img`
  max-width: 50px;
  @media (max-height: 425px) {
    opacity: 0;
  }
`;

const CopyrightText = styled.div`
  display: flex;
  justify-content: start;
  width: 70%;
  font-weight: 100;
  font-size: 14px;
`;

const FormBox = styled.div`
  width: 70%;
  height: 65%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const H1 = styled.h1`
  font-size: 36px;
  margin-top: 0;
  font-weight: 600;
  color: #0a071b;
  font-family: "Poppins", sans-serif;
`;

const H4 = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #5b5675;
  margin-top: 10px;
  font-family: "Poppins", sans-serif;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-family: "Poppins", sans-serif;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  width: 100%;
  margin-top: 12px;
`;

const Input = styled.input`
  border: #e1dfec 2px solid;
  width: 100%;
  padding: 15px;
  border-radius: 46px;
  background-color: white;
  margin: 5px 0;
  font-size: 12px;
`;

const ForgetPas = styled.label`
  font-size: 12px;
  font-weight: 600;
  width: 100%;
  text-align: right;
  margin-top: 12px;
  cursor: pointer;
`;

const LoginBackgroundImg = styled.img`
  opacity: 0.2;
`;

const WhiteBtn = styled.button`
  border: none;
  outline: none;
  padding: 12px 0;
  background-color: white;
  border-radius: 20px;
  width: 180px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
`;

const BlackBtn = styled(WhiteBtn)`
  background-color: #0a071b;
  color: white;
  width: 100%;
  padding: 17px;
  margin: 5px 0;
  font-size: 14px;
  border-radius: 46px;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-top: 12px;
`;

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      window.location = "/";
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Container>
      <LeftContainer>
        <Left>
          <LeftLogo>
            <LogoImg src="loginLogo.png" alt="Autograder logo" />
          </LeftLogo>
          <FormBox>
            <div>
              <H1>Login</H1>
              <H4>The easiest way to grade code for teachers!</H4>
            </div>
            <FormContainer onSubmit={handleSubmit}>
              <Label htmlFor="email-login">Email</Label>
              <Input
                type="email"
                id="email-login"
                placeholder="mail@website.com"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Label htmlFor="password-login">Password</Label>
              <Input
                type="password"
                id="password-login"
                placeholder="Min. 8 character"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <ForgetPas>Forget Password?</ForgetPas>
              <BlackBtn type="submit">Login</BlackBtn>
              <Label style={{ fontWeight: 400 }}>
                Not registered yet?
                <Link to="/signup" style={{ fontWeight: 600 }}>
                  {" "}
                  Create an account
                </Link>
              </Label>
            </FormContainer>
          </FormBox>
          <CopyrightText>©2023 Siddharth. All rights reserved.</CopyrightText>
        </Left>
      </LeftContainer>
      <RightContainer>
        <LoginBackgroundImg src="loginBackground.jpg" alt="Background Image" />
      </RightContainer>
    </Container>
  );
};

export default Login;
