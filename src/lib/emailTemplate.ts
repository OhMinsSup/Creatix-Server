export const emailTemplate = (code: string) => {
  return `
<a href="/">
    <img src="https://images.velog.io/email-logo.png" style="display: block; width: 128px; margin: 0 auto;"/>
</a>
<div style="max-width: 100%; width: 400px; margin: 0 auto; padding: 1rem; text-align: justify; background: #f8f9fa; border: 1px solid #dee2e6; box-sizing: border-box; border-radius: 4px; color: #868e96; margin-top: 0.5rem; box-sizing: border-box;">
    <b style="black">안녕하세요! </b>이메일 인증을 계속하시려면 해당 코드를 인증 모달에 적어주세요
</div>
<div style="text-align: center; margin-top: 1rem; color: #868e96; font-size: 2rem;">
    <span style=" color: rgb(114, 137, 218); padding: 5px; border-radius: 5px; border: 2px solid rgb(114, 137, 218);">
        ${code}
    </span>
</div>
<div style="text-align: center; margin-top: 1rem; color: #868e96; font-size: 0.85rem;"><br/>
  <div>이 링크는 24시간동안 유효합니다. </div>
</div>
`;
};
