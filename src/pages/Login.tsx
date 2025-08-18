import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    console.log('Login attempt:', { username, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Styled components (scoped under this component per preference)
  const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 2 * clamp(16px, 2vw, 32px));
    width: calc(100vw - 2 * clamp(16px, 2vw, 32px));
    background-color: #f8f9fa;
    padding: clamp(16px, 2vw, 32px);
  `;

  const LoginCard = styled.div`
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    padding: clamp(20px, 3vw, 36px);
    min-width: 400px;
    max-width: none;
    text-align: center;
    @media (max-width: 768px) {
      min-width: 350px;
    }
    @media (max-width: 425px) {
      min-width: 250px;
    }
  `;

  const LogoContainer = styled.div`
    margin-bottom: 10px;
  `;

  const Logo = styled.img`
    width: clamp(56px, 10vw, 88px);
    height: clamp(56px, 10vw, 88px);
  `;

  const AppTitle = styled.h1`
    margin: 0;
    color: #333;
    font-size: clamp(20px, 2.5vw, 28px);
    font-weight: 700;
  `;

  const AppVersion = styled.p`
    margin: 6px 0 24px;
    color: #6c757d;
    font-size: clamp(12px, 1.5vw, 14px);
  `;

  const FormGroup = styled.div`
    margin-bottom: 20px;
    text-align: left;
  `;

  const Label = styled.label`
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    color: #333;
  `;

  const FormControl = styled.input`
    width: 100%;
    padding: clamp(10px, 1.4vw, 14px) clamp(12px, 1.6vw, 16px);
    font-size: clamp(14px, 1.8vw, 16px);
    font-family: inherit;
    border: 1px solid #ced4da;
    border-radius: 10px;
    box-sizing: border-box;
    &::placeholder { font-family: inherit; }
  `;

  const PasswordInputContainer = styled.div`
    position: relative;
  `;

  const TogglePassword = styled.button`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #6c757d;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 20px;
      height: 20px;
    }
  `;

  const Button = styled.button`
    width: 100%;
    padding: clamp(12px, 1.8vw, 14px);
    border: none;
    border-radius: 10px;
    font-size: clamp(14px, 1.8vw, 16px);
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  `;

  const LoginButton = styled(Button)`
    background-color: #e9ecef;
    color: #333;
    margin-bottom: 20px;
    
    &:hover {
      background-color: #dde2e6;
    }
  `;

  const Separator = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
    
    &::before,
    &::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #ced4da;
    }
    
    span {
      padding: 0 10px;
      color: #6c757d;
      font-size: 14px;
    }
  `;

  const DarkButton = styled(Button)`
    background-color: #282c45;
    color: white;
    margin-bottom: 10px;
    
    &:hover {
      background-color: #1e2235;
    }
  `;

  return (
    <LoginContainer>
      <LoginCard>
        <LogoContainer>
          <Logo src="/logo128.png" alt="Connect2Bulk Logo" />
        </LogoContainer>
        <AppTitle>Connect 2 Bulk</AppTitle>
        <AppVersion>v0.0.0</AppVersion>
        
        <form onSubmit={handleLogin}>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <FormControl
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <PasswordInputContainer>
              <FormControl
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <TogglePassword 
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </TogglePassword>
            </PasswordInputContainer>
          </FormGroup>
          
          <LoginButton type="submit">Login</LoginButton>
          
          <Separator>
            <span>OR</span>
          </Separator>
          
          <DarkButton type="button" onClick={() => navigate('/register')}>Register</DarkButton>
          <DarkButton type="button" onClick={() => alert('TODO: Implement Forgot Password flow')}>Forgot Password</DarkButton>
        </form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;