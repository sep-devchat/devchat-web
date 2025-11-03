export interface CodeItemData {
	id: number;
	fileName: string;
	code: string;
}

const code1 = `#include <stdio.h>

int main(void) {
    printf("Hello, world!\\n");
    printf("Hello, world!\\n");
    printf("Hello, world!\\n");
    printf("Hello, world!\\n");
    printf("Hello, world!\\n");
    return 0;
}`;

export const codeData: CodeItemData[] = [
	{
		id: 1,
		fileName: "code1.c",
		code: code1,
	},
	{
		id: 2,
		fileName: "code2.c",
		code: code1,
	},
	{
		id: 3,
		fileName: "example.js",
		code: `function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet("User");`,
	},
];
