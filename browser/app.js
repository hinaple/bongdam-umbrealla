(async function() {
    const Container = document.getElementById("apps");
    const Heads = [ "이름", "학번", "전화번호", "상태", "활성화", "삭제" ];

    function Td(child) {
        const td = document.createElement("td");
        console.log(child);
        td.append(child);
        return td;
    }

    async function rerender() {
        Container.innerHTML = '';
        const headTr = document.createElement("tr");
        for(let i = 0; i < Heads.length; i++) {
            const th = document.createElement("th");
            th.innerText = Heads[i];
            headTr.append(th);
        }
        Container.appendChild(headTr);
        const list = await fetch("api/umbrella").then(result => result.json());
        console.log(list);
        for(let i = 0; i < list.length; i++) {
            const tr = document.createElement("tr");
            
            let enable = null;
            if(list[i].status === "waiting") {
                enable = document.createElement("button");
                enable.innerText = "활성화";
                enable.addEventListener("click", async () => {
                    const umbrellaNumber = prompt("우산 번호를 입력하세요.");
                    await fetch("api/umbrella", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ number: list[i].number, umbrellaNumber })
                    }).then(result => result.json());
                    alert("정상적으로 대여 처리가 완료되었습니다.");
                    rerender();
                });
            }
            else enable = '-';
            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "삭제";
            deleteBtn.addEventListener("click", async () => {
                if(!window.confirm(`${list[i].name}(${list[i].number})님의 우산 대여 데이터를 정말 삭제하시겠습니까?`)) return;
                await fetch("api/umbrella", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ number: list[i].number })
                }).then(result => result.json());
                alert("정상적으로 삭제되었습니다.");
                rerender();
            })

            tr.append(
                Td(list[i].name),
                Td(list[i].number),
                Td(list[i].phone),
                Td(
                    list[i].status === "waiting"?
                    "대기중": `대여중/${list[i].umbrellaNumber}`
                ),
                Td(enable),
                Td(deleteBtn)
            )

            Container.appendChild(tr);
        }
    }

    await rerender();
})();