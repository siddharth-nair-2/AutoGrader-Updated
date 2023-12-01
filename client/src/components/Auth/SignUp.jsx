import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { notification } from "antd";
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
  @media (max-width: 300px) {
    margin-top: 25px;
    width: 100%;
  }
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
  @media (max-height: 650px) {
    opacity: 0;
    margin-top: 100px;
  }
  @media (max-height: 860px) {
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

const LabelTerms = styled.label`
  font-size: 12px;
  font-weight: 400;
  width: 100%;
  margin-left: 10px;
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

const Select = styled.select`
  border: #e1dfec 2px solid;
  width: 100%;
  padding: 15px;
  border-radius: 46px;
  background-color: white;
  margin: 5px 0;
  font-size: 12px;
`;

const LoginBackgroundImg = styled.img`
  opacity: 0.2;
  object-fit: cover;
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

const Signup = () => {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [password, setPassword] = useState();
  const [userType, setUserType] = useState();
  const [terms, setTerms] = useState(false);
  const [email, setEmail] = useState();
  const { registerUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!terms) {
      notification.error({
        message: "Terms & Conditions!",
        description: "Please read through and accept the Terms & Conditions!",
        placement: "bottomLeft",
        duration: 4,
      });
      return;
    }
    if (!firstName || !lastName || !email || !password || userType === "") {
      notification.error({
        message: "Missing Information",
        description: "Pleast enter all information!",
        duration: 4,
        placement: "bottomLeft",
      });
      return;
    }
    if (password.length < 8) {
      notification.error({
        message: "Invalid Password",
        description: "Password should be at least 8 characters!",
        duration: 4,
        placement: "bottomLeft",
      });
      return;
    }
    const emailRegex = new RegExp(
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "gm"
    );
    if (!emailRegex.test(email)) {
      notification.error({
        message: "Invalid Email",
        description: "Your email has an invalid format!",
        duration: 4,
        placement: "bottomLeft",
      });
      return;
    }
    try {
      await registerUser(firstName, lastName, email, password, userType);
      setTimeout(() => {
        window.location = "/login";
      }, "500");
      notification.success({
        message: "Success!",
        description: "Your account has been created!",
        duration: 1,
        placement: "bottomLeft",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      notification.error({
        message: "Error!",
        description: errorMessage,
        duration: 5,
        placement: "bottomLeft",
      });
    }
  };

  return (
    <Container>
      <RightContainer>
        <LoginBackgroundImg src="signupBackground.jpg" alt="Background Image" />
      </RightContainer>
      <LeftContainer>
        <Left>
          <LeftLogo>
            <LogoImg src="loginLogo.png" alt="Autograder logo" />
          </LeftLogo>
          <FormBox>
            <div>
              <H1>Sign Up</H1>
              <H4>The easiest way to grade code for teachers!</H4>
            </div>
            <FormContainer onSubmit={handleSubmit}>
              <Label htmlFor="fName-signup">First Name</Label>
              <Input
                type="text"
                placeholder="First Name"
                name="firstName"
                id="fName-signup"
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Label htmlFor="lName-signup">Last Name</Label>
              <Input
                type="text"
                placeholder="Last Name"
                name="lastName"
                id="lName-signup"
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <Label htmlFor="email-signup">Email</Label>
              <Input
                type="email"
                placeholder="mail@website.com"
                name="email"
                id="email-signup"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Label htmlFor="password-signup">Password</Label>
              <Input
                type="password"
                placeholder="Min. 8 Characters"
                name="password"
                id="password-signup"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Label htmlFor="type-signup">Role</Label>
              <Select
                required
                name="userType"
                id="type-signup"
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="" selected disabled hidden>
                  Choose role
                </option>
                <option value="Instructor">Instructor</option>
                <option value="Student">Student</option>
              </Select>
              <div
                style={{ display: "flex", width: "100%", marginTop: "12px" }}
              >
                <input
                  type="checkbox"
                  className="checkBoxSignup"
                  name="checkBox2"
                  id="checkBox2"
                  value="checked"
                  onChange={(e) => setTerms(!terms)}
                />
                <LabelTerms style={{ width: "100%" }} htmlFor="checkBox2">
                  I agree to the{" "}
                  <a
                    href="https://rb.gy/enaq3a"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontWeight: 600, cursor: "pointer" }}
                  >
                    Terms & Conditions
                  </a>
                  .
                </LabelTerms>
              </div>
              <BlackBtn type="submit">Sign Up</BlackBtn>
              <Label style={{ fontWeight: 400 }}>
                Already have an account?
                <Link to="/login" style={{ fontWeight: 600 }}>
                  {" "}
                  Sign in
                </Link>
              </Label>
            </FormContainer>
          </FormBox>
          <CopyrightText></CopyrightText>
        </Left>
      </LeftContainer>
    </Container>
  );
};

export default Signup;
