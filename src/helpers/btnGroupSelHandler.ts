export function btnGroupSelHandler($btn: HTMLElement, btngroup: HTMLElement[]) {
    btngroup.forEach((btn) => {
        btn.classList.remove('selected');
    });
    $btn.classList.add('selected');
}
